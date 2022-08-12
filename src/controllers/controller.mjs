import getConnection from "../database/database.mjs";
import bcrypt from "bcrypt";

const getDefault = (req, res) => {
  res.json("Hola Mundo");
};

const insertTotal = async (req, res) => {
  try {
    const { total, userid} = req.body;
    let sql = "INSERT INTO totales( total, usuarioid, fecha) VALUES ( ?, ?, NOW())";
    const connection = await getConnection();
    await connection.query(sql, [total, userid]);
    res.json({
      msg: "Guardado correctamente.",
    });
  } catch (error) {
    res.status(404).json({ msg: "No se pudo guardar." });
  }
};
const getCurrentMonthTotal = async (req, res) => {
  try{
    const { userId, currentDay} = req.params;
    let sql = `SELECT id_total AS "id", total, usuarioid, fecha FROM totales WHERE usuarioid = ? AND fecha <= NOW() AND fecha >= DATE_ADD(NOW(), INTERVAL -? DAY)`;
    const connection = await getConnection();
    let result = await connection.query(sql, [userId, currentDay]);
    res.json(result);
  }catch (error){
    res.status(500).json(error);
  }
};


const getLastTotal = async (req, res) => {
  try {
    let sql = `SELECT * FROM totales WHERE usuarioId = ? ORDER BY Id_total DESC LIMIT 1`;
    const connection = await getConnection();
    let result = await connection.query(sql, req.params.userid);
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateObjetive = async (req, res) => {
  try {
    const {idEvento} = req.body;
    const connection = await getConnection();
    let sql = "UPDATE objetivos SET cumplido = 1 WHERE id_objetivo = ?";
    await connection.query(sql, idEvento);
    res.json({msg: "Guardado Correctamente"});

  } catch (error) {
    res.json(error);
  }
}

const deleteObjetvie =  async (req, res) => {
  //Se elimina
  try {
    let sql = "DELETE FROM objetivos where id_objetivo=?";
    const connection = await getConnection();
    await connection.query(sql, req.params.idEvento);
    res.json({ msg: "Eliminado correctamente." });
  } catch (error) {
    res.status(500).json(error);
  }
};

const insertObjetive = async (req, res) => {
  //Se recibe la informacion del frontend
  try {
    const { objetive, date1, IdActivo } = req.body;
    let sql =
      "INSERT INTO objetivos(objetivo, fecha, movimientoid, cumplido) VALUES (?, ?, ?, 0)";
    const connection = await getConnection();
    await connection.query(sql, [objetive, date1, IdActivo]);

    res.json({ msg: "Guardado Correctamente." });
  } catch (error) {
    res.status(404).json({ msg: "No se pudo guardar." });
  }
};

const deleteMovement = async (req, res) => {
  //Se elimina
  try {
    const { idActivo } = req.params;
    let sql = "DELETE FROM movimientos WHERE id_movimiento=?";
    const connection = await getConnection();
    await connection.query(sql, idActivo);
    res.json({ msg: "Eliminado correctamente." });
  } catch (error) {
    res.status(500).json(error);
  }
};

const insertMovement = async (req, res) => {
  try {
    //Se recibe la informacion del frontend
    const { nombreActivo, valorActivo, idAccion, idUsuario } = req.body;

    let sql =
      "INSERT INTO movimientos(nombre, valor, pygId, usuarioId) VALUES (?, ?, ?, ?)";
    const connection = await getConnection();
    await connection.query(sql, [nombreActivo, valorActivo, idAccion, idUsuario]);

    res.json({
      msg: "Guardado correctamente.",
    });
  } catch (error) {
    res.status(404).json({ msg: "No se pudo guardar." });
    console.log(error)
  }
};

const getObjetive = async (req, res) => {
  try {
    const { userId, currentDay } = req.params;
    let sql = `SELECT objetivos.id_objetivo AS "id", objetivos.fecha AS "start", movimientos.nombre AS "title", movimientos.valor AS "valor", pyg.accion AS "accion"
    FROM objetivos 
    INNER JOIN movimientos ON objetivos.movimientoid = movimientos.id_movimiento 
    INNER JOIN usuarios ON movimientos.usuarioid = usuarios.id_usuario
    INNER JOIN pyg ON movimientos.pygid = pyg.id_pyg
    WHERE usuarios.id_usuario= ? AND fecha <= NOW() AND fecha >= DATE_ADD(NOW(), INTERVAL -? DAY)`;
    const connection = await getConnection();
    let result = await connection.query(sql, [userId, currentDay]);
    res.json(result);
  } catch (error) {
    console.log(error);
    
  }
};

const updateAllDetails = async (req, res) =>{
  try {
    const {name, value, pygid, objetive, date1, id_objetive, id_move} = req.body;
    let sql = `UPDATE
                  movimientos
               SET 
                  nombre = ?, valor = ?, pygid = ?
               WHERE id_movimiento = ?`;
               
    const connection = await getConnection();
    await connection.query(sql, [name, value, pygid, id_move]);

    sql = `UPDATE
                  objetivos
               SET 
                  objetivo = ?, fecha = ?, cumplido = 0
               WHERE id_objetivo = ?`;
   await connection.query(sql, [objetive, date1, id_objetive]);

    res.json({msg: "Guardado Correctamente"});
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Error" });
  }
};

//Metodo para hacer inner join de las tablas objetivos y activos
const getAllDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    let sql = `SELECT objetivos.id_objetivo AS "id", objetivos.objetivo AS "objetivo", objetivos.fecha AS "start", movimientos.nombre AS "title", movimientos.valor AS "valor", pyg.accion AS "accion", objetivos.cumplido AS "cumplido", movimientos.id_movimiento AS "id_movimiento" FROM objetivos INNER JOIN movimientos ON objetivos.movimientoid = movimientos.id_movimiento INNER JOIN usuarios ON movimientos.usuarioid = usuarios.id_usuario INNER JOIN pyg ON movimientos.pygid = pyg.id_pyg WHERE usuarios.id_usuario = ?`;
    const connection = await getConnection();
    let result = await connection.query(sql,userId);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

//Metodo para hacer inner join de las tablas usuarios y activos
const getActive = async (req, res) => {
  try {
    let sql = "select id_movimiento as id, nombre as title, valor from movimientos inner join usuarios on usuarios.id_usuario = movimientos.usuarioid where usuarios.id_usuario= ?";
    const connection = await getConnection();
    let result = await connection.query(sql, req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ msg: "Error" });
  }
};

const deleteUser = async (req, res) =>{
  try {
    const { userId } = req.params;
    let sql = "CALL deleteUser(?)";
    const connection = await getConnection();
    await connection.query(sql, userId);
    res.json({ msg: "Eliminado correctamente." });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      userId,
      usuario,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      email,
      password,
      password2
    } = req.body;
    //Se comparan las contraseñas enviadas por el frontend
    if (password !== password2)
      return res
      .status(400)
      .json({ msg: "Contraseña y confirmar contraseña son incorrectos." });

    //Se modifica la contraseña enviada
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    //Se crea el usuario en la bd.

    let sql = `
    UPDATE
      usuarios
    SET
      primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, correo = ?, contrasena = ?, usuario = ?
    WHERE id_usuario = ? `;
    const connection = await getConnection();
    await connection.query(sql, [nombre1, nombre2, apellido1, apellido2, email, hashPassword, usuario, userId]);

    res.json({msg: "Guardado Correctamente"});
    
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    let userid = req.params.userid;
    let sql = "SELECT Id_Usuario AS 'id', Primer_Nombre AS 'PRIMER_NOMBRE', Segundo_Nombre AS 'SEGUNDO_NOMBRE', Primer_Apellido AS 'PRIMER_APELLIDO', Segundo_Apellido AS 'SEGUNDO_APELLIDO', Correo AS 'CORREO', Contrasena 'CONTRASENA', Usuario AS 'USUARIO' FROM usuarios WHERE id_usuario = ?";
    const connection = await getConnection();
    let result = await connection.query(sql, userid);
    res.json(result);
  } catch (error) {
    res.status(404).json({ msg: "Usuario no encontrado" });
  }
};

const login =async (req, res) => {
    try {
      let usuario = req.body.user;
      let sql = "SELECT Id_Usuario AS 'id', Primer_Nombre AS 'PRIMER_NOMBRE', Segundo_Nombre AS 'SEGUNDO_NOMBRE', Primer_Apellido AS 'PRIMER_APELLIDO', Segundo_Apellido AS 'SEGUNDO_APELLIDO', Correo AS 'CORREO', Contrasena 'CONTRASENA', Usuario AS 'USUARIO' FROM usuarios WHERE usuario = ?";
      const connection = await getConnection();
      let result = await connection.query(sql, usuario);
      //Se compara la contraseña enviada del frontend y la existente en la bd
      const match = await bcrypt.compare(req.body.password, result[0].CONTRASENA);
      if (!match) return res.status(400).json({ msg: "Contraseña Erronea" });
      res.json(result);
    } catch (error) {
      res.status(404).json({ msg: "Usuario no encontrado" });
      console.log(error);
    }
  };

  
const register = async (req, res) => {
  try {
    //Se recibe la informaciond del frontend
    const {
      usuario,
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      email,
      password,
      password2,
    } = req.body;
    //Se comparan las contraseñas enviadas por el frontend
    if (password !== password2)
      return res
        .status(400)
        .json({ msg: "Contraseña y confirmar contraseña son incorrectos." });

    //Se modifica la contraseña enviada
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    //Se crea el usuario en la bd.
    let sql =
      "INSERT INTO usuarios(primer_nombre,segundo_nombre,primer_apellido,segundo_apellido,correo,contrasena,usuario) VALUES (?,?,?,?,?,?,?)";

    const connection = await getConnection();
    await connection.query(sql, [
      nombre1,
      nombre2,
      apellido1,
      apellido2,
      email,
      hashPassword,
      usuario,
    ]);

    res.json({
      message: "Todo bien todo correcto y yo me que alegro",
    });
  } catch (error) {
    console.log(error);
  }
};

export const methods = {
    getDefault,
    register,
    login,
    getUser,
    updateUser,
    deleteUser,
    getActive,
    getAllDetails,
    updateAllDetails,
    getObjetive,
    insertMovement,
    deleteMovement,
    insertObjetive,
    deleteObjetvie,
    updateObjetive,
    getLastTotal,
    getCurrentMonthTotal,
    insertTotal
};