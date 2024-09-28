document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#crearcurso form');
    const listadoCursos = document.querySelector('.cursos');

    cargarCursos();

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Con esto ya no se refresca la página

        // Valores del formulario
        const nombreCurso = form.querySelector('input[placeholder="Ej: Electrónica"]').value;
        const nombreInstructor = form.querySelector('input[placeholder="Nombre del instructor"]').value;
        const fechaInicio = form.querySelector('input[type="date"]').value;
        const fechaFin = form.querySelectorAll('input[type="date"]')[1].value;
        const descripcion = form.querySelector('textarea').value;

        const error = validarFormulario(nombreCurso, nombreInstructor, fechaInicio, fechaFin, descripcion);

        if (error) {
            mostrarError(error);
            return;
        }

        const duracion = calcularDuracionMeses(fechaInicio, fechaFin);

        const curso = {
            nombre: nombreCurso,
            instructor: nombreInstructor,
            fechaInicio: fechaInicio,
            duracion: duracion,
            descripcion: descripcion
        };

        agregarCursoLocalStorage(curso);
        form.reset();
        agregarCursoListado(curso);
    });

    function calcularDuracionMeses(fechaInicio, fechaFin) {
        // Esta funcion calcula la duracion del curso segun las fechas ingresadas en el formulario.
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        const diffAnios = fin.getFullYear() - inicio.getFullYear();
        const diffMeses = fin.getMonth() - inicio.getMonth();

        return diffAnios * 12 + diffMeses;
    }

    function agregarCursoLocalStorage(curso) {
        // La funcion agrega el nuevo curso a localStorage.
        let cursos = obtenerCursosLocalStorage();
        cursos.push(curso);
        localStorage.setItem('cursos', JSON.stringify(cursos));
    }

    function obtenerCursosLocalStorage() {
        // Obtiene los cursos de localStorage
        let cursos = localStorage.getItem('cursos');
        return cursos ? JSON.parse(cursos) : [];
    }

    function agregarCursoListado(curso) {
        // La funcion agrega el nuevo curso a la lista de cursos.
        const divCurso = document.createElement('div');
        divCurso.classList.add('curso');

        // Se genera la estructura con las clases correspondientes para el nuevo curso.
        divCurso.innerHTML = `
            <p><span class="curo-caracteristica">Nombre:</span> ${curso.nombre}</p>
            <p><span class="curo-caracteristica">Instructor:</span> ${curso.instructor}</p>
            <p><span class="curo-caracteristica">Fecha de Inicio:</span> ${curso.fechaInicio}</p>
            <p><span class="curo-caracteristica">Duración:</span> ${curso.duracion} meses</p>
            <p class="curso-mostrar-info">Información completa</p>
            <div class="curso-descripcion" style="display: none;">
                <p class="curso-descripcion"><span class="curo-caracteristica">Descripción: </span>${curso.descripcion}</p>
            </div>
        `;

        listadoCursos.appendChild(divCurso);

        // Controlar el comportamiento del boton para mostrar la descripcion, cambiando su texto para que sea mas dinámico.
        const botonMostrarInfo = divCurso.querySelector('.curso-mostrar-info');
        botonMostrarInfo.addEventListener('click', function() {
            const descripcion = this.nextElementSibling;
            const isHidden = descripcion.style.display === 'none';
            
            descripcion.style.display = isHidden ? 'block' : 'none';            
            this.textContent = isHidden ? 'Mostrar Menos' : 'Información completa';
        });
    }

    function cargarCursos() {
        // Función que carga los cursos de localstorage
        let cursos = obtenerCursosLocalStorage();
        cursos.forEach(curso => agregarCursoListado(curso));
    }

    function validarFormulario(nombreCurso, nombreInstructor, fechaInicio, fechaFin, descripcion) {
        // Funcion para validar los ingresos del usuario
        const hoy = new Date().toISOString().split('T')[0];
        
        if (!nombreCurso || !nombreInstructor || !fechaInicio || !fechaFin || !descripcion) {
            return "Todos los campos son obligatorios.";
        }

        if (fechaInicio < hoy) {
            return "La fecha de inicio debe ser hoy o una fecha futura.";
        }

        if (fechaFin <= fechaInicio) {
            return "La fecha de fin debe ser posterior a la fecha de inicio.";
        }

        if (descripcion.length < 30) {
            return "La descripción debe tener al menos 30 caracteres.";
        }

        return null; // No hay errores
    }

    function mostrarError(mensaje) {
        // Mostrar el mensaje de error durante 5 segundos
        const errorParrafo = document.querySelector(".error");
        errorParrafo.textContent = mensaje;
        errorParrafo.style.display = 'block';

        setTimeout(() => {
            errorParrafo.textContent = '';
            errorParrafo.style.display = 'none';
        }, 5000);
    }
});