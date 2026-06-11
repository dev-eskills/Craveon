const { getIO } = require("../config/socket");
const LogModel = require("../models/LogModel");

const saveLog = async (data) => {
  try {
    const log = await LogModel.create(data);

    const io = getIO();

    io.emit("new-log", log);

    return log;
  } catch (error) {
    console.error(error);
  }
};

const getLogs = async(req,res)=>{
  try {
    const logs = await LogModel.find()
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    data: logs,
  });
  } catch (error) {
    console.error(error);
  }
}
module.exports = { saveLog, getLogs };