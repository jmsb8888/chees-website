const express = require("express");
const cors = require("cors");
const path = require("path");

const router = express.Router();

let opiniones = [];
router.post("/opinion", (req, res) => {
  const { nombre, calificacion, opinion } = req.body;
    if (!nombre || !calificacion || !opinion) {
    return res.status(400).json({ 
      message: "Todos los campos son obligatorios",
      success: false 
    });
  }

  const nuevaOpinion = {
    id: Date.now(),
    nombre: nombre.trim(),
    calificacion: parseInt(calificacion),
    opinion: opinion.trim(),
    fecha: new Date().toLocaleString()
  };
  
  opiniones.push(nuevaOpinion);
  
  res.json({ 
    message: `¡Gracias ${nombre}! Tu opinión se registró con éxito.`,
    success: true 
  });
});

router.get("/opiniones", (req, res) => {
  res.json(opiniones);
});

// Si este archivo se ejecuta directamente (no importado como módulo)
if (require.main === module) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(express.static(path.join(__dirname, "frontend")));

  app.use("/api", router);

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = router;
