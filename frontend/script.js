// Configuración de la URL base del API
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : window.location.origin;

const verComentariosBtn = document.getElementById("verComentariosBtn");
const listaComentarios = document.getElementById("listaComentarios");
const opinionForm = document.getElementById("opinionForm");
const mensajeDiv = document.getElementById("mensaje");

opinionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById("nombre").value.trim();
  const calificacion = document.getElementById("calificacion").value;
  const opinion = document.getElementById("opinion").value.trim();
  
  if (!nombre || !calificacion || !opinion) {
    mensajeDiv.innerHTML = "⚠️ Todos los campos son obligatorios";
    mensajeDiv.style.color = "var(--marron-elegante)";
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/opinion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        calificacion: parseInt(calificacion),
        opinion
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      mensajeDiv.innerHTML = `✅ ${result.message}`;
      mensajeDiv.style.color = "var(--verde-esmeralda)";
      opinionForm.reset();
      if (listaComentarios.children.length > 0) {
        cargarComentarios();
      }
    } else {
      throw new Error(result.message);
    }
    
  } catch (error) {
    mensajeDiv.innerHTML = `❌ Error: ${error.message}`;
    mensajeDiv.style.color = "#e74c3c";
  }
});

async function cargarComentarios() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/opiniones`);
    const opiniones = await response.json();
    listaComentarios.innerHTML = "";

    if (opiniones.length === 0) {
      listaComentarios.innerHTML = '<li class="comentario-vacio">No hay comentarios todavía.</li>';
      return;
    }

    opiniones.forEach(op => {
      const li = document.createElement("li");
      li.className = "comentario-item";
      const estrellas = "⭐".repeat(op.calificacion);
      
      li.innerHTML = `
        <div class="comentario-header">
          <strong class="comentario-nombre">${op.nombre}</strong>
          <span class="comentario-calificacion">${estrellas} (${op.calificacion}/5)</span>
        </div>
        <p class="comentario-texto">${op.opinion}</p>
        ${op.fecha ? `<small class="comentario-fecha">${op.fecha}</small>` : ''}
      `;
      
      listaComentarios.appendChild(li);
    });
  } catch (error) {
    listaComentarios.innerHTML = '<li class="comentario-error">❌ Error al cargar comentarios</li>';
  }
}

verComentariosBtn.addEventListener("click", () => {
  if (listaComentarios.style.display === "block") {
    listaComentarios.style.display = "none";
    verComentariosBtn.textContent = "Ver comentarios";
  } else {
    listaComentarios.style.display = "block";
    verComentariosBtn.textContent = "Ocultar comentarios";
    cargarComentarios();
  }
});


const track = document.querySelector(".carousel-track");
const images = document.querySelectorAll(".carousel-track img");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

let index = 0;
const total = images.length;

function mostrarImagen() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

function siguiente() {
  index = (index + 1) % total;
  mostrarImagen();
}

function anterior() {
  index = (index - 1 + total) % total;
  mostrarImagen();
}

nextBtn.addEventListener("click", siguiente);
prevBtn.addEventListener("click", anterior);

setInterval(siguiente, 5000);

