module.exports = (sequelize, DataTypes) => {

  const {Model } = sequelize.Sequelize
  class Room extends Model{}

  Room.init({
    name: {
      type : DataTypes.STRING,
      validate : {
        len: {
          // validasi nama room jika lebih dari 12 huruf atau kurang dari 4 huruf
          args: [4,12],
          msg: "room name must more then 4 letters"
        } 
      }
    },
    players: {
      type : DataTypes.JSON,
      validate : {
        // validasi jika jumlah pemain didalam pleyers lebih dari 4
        checkMaxPlayers(value){
          if(Object.keys(value).length > 4) {
            throw new Error('Maximum player reached')
          }
        }
      }
    } 
  }, {
    sequelize
  })

  Room.associate = function(models) {
    // associations can be defined here
  };
  return Room;
};