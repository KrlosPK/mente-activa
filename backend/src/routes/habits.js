import express from "express";
import { Habit } from "../models/index.js";

const router = express.Router();


// EDITAR
router.put("/:id", async (req, res) => {
  try {
    const habit = await Habit.findByPk(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: "No encontrado" });
    }

    await habit.update(req.body);
    res.json(habit);
  } catch (error) {
    res.status(500).json({ msg: "Error actualizando" });
  }
});

// ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    const habit = await Habit.findByPk(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: "No encontrado" });
    }

    await habit.destroy();
    res.json({ msg: "Eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error eliminando" });
  }
});

export default router;