var request = require('request');
const event = require('events');

var eventEmitter = new event.EventEmitter();

eventEmitter.on('completed', () => {
    console.log('Token Created and Card Activated');
});

module.exports = (token, cardName, req, res) => {
    let options = {
        method: 'POST',
        url: 'http://54.186.160.3:3000/api/wallet/' + cardName + '/setDefault',
        headers: {
            'X-Access-Token': token
        }
    };
    request(options, (error, response, body) => {
        if (error) {
            res.send(error);
        }
        else{
            eventEmitter.emit('completed');
            res.json({
                access_token: token,
                status: 'success'
            });
        }
    });

}