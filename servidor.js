const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db.js')


app.use((err, req, res, next) => {
    console.error('Error no capturado:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.use(express.json());


//----- HABITACIONES -----

// Consulta todas las habitaciones
app.get('/rooms', async (req, res, next) => {
    try {
        const query = 'SELECT * FROM habitaciones';
        const [rows] = await db.promise().query(query);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

// Consulta una habitación por código
app.get('/rooms/:codigo', async (req, res, next) => {
    try {
        const { codigo } = req.params;
        const query = 'SELECT * FROM `habitaciones` WHERE código = ?';
        const [rows] = await db.promise().query(query, [codigo]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Habitación no encontrada' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        next(error);
    }
});

// Crea una nueva habitación
app.post('/rooms', async (req, res, next) => {
    try {
        const { código, número, tipo, valor } = req.body;
        const query = 'INSERT INTO habitaciones (código, número, tipo, valor) VALUES (?, ?, ?, ?)';
        await db.promise().execute(query, [código, número, tipo, valor]);
        res.status(201).json({ message: 'Habitación creada exitosamente' });
    } catch (error) {
        next(error);
    }
});

// Actualiza una habitación por código
app.patch('/rooms/:codigo', async (req, res, next) => {
    try {
        const { código } = req.params;
        const { número, tipo, valor } = req.body;
        const query = 'UPDATE habitaciones SET número = ?, tipo = ?, valor = ? WHERE código = ?';
        await db.promise().execute(query, [número, tipo, valor, código]);
        res.json({ message: 'Habitación actualizada exitosamente' });
    } catch (error) {
        next(error);
    }
});

// Elimina una habitación por código
app.delete('/rooms/:codigo', async (req, res, next) => {
    try {
        const { código } = req.params;
        const query = 'DELETE FROM habitaciones WHERE código = ?';
        await db.promise().execute(query, [código]);
        res.json({ message: 'Habitación eliminada exitosamente' });
    } catch (error) {
        next(error);
    }
});





//----- RESERVAS -----

// Consulta todas las reservas
app.get('/bookings', async (req, res, next) => {
    try {
        const query = 'SELECT * FROM `reservas`';
        const [rows] = await db.promise().query(query);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

// Consulta una reserva por código
app.get('/bookings/:codigo', async (req, res, next) => {
    try {
        const { codigo } = req.params;
        const query = 'SELECT * FROM reservas WHERE código = ?';
        const [rows] = await db.promise().query(query, [codigo]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Reserva no encontrada' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        next(error);
    }
});

// Crea una nueva reserva
app.post('/bookings', async (req, res, next) => {
    try {
        const { código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida } = req.body;
        const query = 'INSERT INTO reservas (código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida) VALUES (?, ?, ?, ?, ?, ?)';
        await db.promise().execute(query, [código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida]);
        res.status(201).json({ message: 'Reserva creada exitosamente' });
    } catch (error) {
        next(error);
    }
});

// Actualiza una reserva por código
app.patch('/bookings/:codigo', async (req, res, next) => {
    try {
        const { código } = req.params;
        const { código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida } = req.body;
        const query = 'UPDATE reservas SET código_habitación = ?, Nombre_cliente = ?, telefono_cliente = ?, fecha_reservación = ?, fecha_entrada = ?, fecha_salida = ? WHERE código = ?';
        await db.promise().execute(query, [código_habitación, Nombre_cliente, telefono_cliente, fecha_reservación, fecha_entrada, fecha_salida, código]);
        res.json({ message: 'Reserva actualizada exitosamente' });
    } catch (error) {
        next(error);
    }
});

// Elimina una reserva por código
app.delete('/bookings/:codigo', async (req, res, next) => {
    try {
        const { código } = req.params;
        const query = 'DELETE FROM reservas WHERE código = ?';
        await db.promise().execute(query, [código]);
        res.json({ message: 'Reserva eliminada exitosamente' });
    } catch (error) {
        next(error);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});