import Sequelize from 'sequelize';
import db from './_db';
const User = db.model('user');

const Message = db.define('message', {
subject: {
  type: Sequelize.STRING,
  defaultValue: 'No Subject'
},
body: {
  type: Sequelize.STRING,
  allowNull: false,
  validate: {
    notEmpty: true
  }
}
})

Message.getAllWhereSender = (id) => {
  return Message.findAll({
    where: {
      fromId: id
    },
    include: [ { model: User, as: 'from' },
              { model: User, as:'to' }
            ]
    })
  }


Message.prototype.truncateSubject = function(subject, ellipses) {
const truncated = this.subject.slice(0, subject)
return {
subject: ellipses ? truncated + '...' : truncated, body: this.body
}
}


export default Message;
