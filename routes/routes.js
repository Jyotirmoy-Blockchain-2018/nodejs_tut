var request = require('request');
const JwtGenerator = require('../jwtgenerator');

module.exports = (app) => {


    app.get('/',function(req,res){
        res.render('index');
    });
    app.post('/adduser', (req,res)=>{
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var email_id = req.body.email_id;
        res.render('adduser',{
            first_name:first_name,
            last_name:last_name,
            email_id:email_id
        });
    });
    // Post Request to Get Token
    app.post('/nsftrackingauth', (req, res) => {
        try {
            var JwtToken = JwtGenerator(req.body.username);
            var cardName = req.body.cardname;
            //res.send(JwtToken);
            let options = {
                method: 'GET',
                url: 'http://54.186.160.3:3000/auth/jwt/callback?token=' + JwtToken,
                maxRedirects: '3',
                followRedirect: false
            };

            request(options, function (error, response, body) {
                // upon a successful request, cookies are stored in response.headers['set-cookie']
                var name = "access_token=";
                console.log('Token Request Recieved');
                var access_token = '';
                var ca = decodeURIComponent(response.headers['set-cookie'][0]).split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        access_token = c.substring(name.length, c.length);
                    }
                }
                
                var matches = access_token.match(/^s:(.+?)\./);
                /* eventEmitter.emit('token_added');
                res.json({
                    access_token: matches[1],
                    jwttoken: JwtToken
                }); */

                require('../services/activateWalletCard')(matches[1],cardName,req,res);

            });
        } catch (error) {
            console.log(error);
        }
    });

    // Get Request Yet to be Iplemented
    app.get('/wallets/:token', (req, res) => {
        
        if (req.params.token) {
            var access_token = req.params.token;
            require('../services/getWallets')(access_token,req, res);
        }
        else{
            res.send('Not Authorized');
        }        

    });

    // Activate Card
    app.post('/activatecard',(req,res)=>{
        var token = req.body.access_token;
        var cardName = req.body.cardname;
        if(!cardName || !token){
            res.send('Autherization Required');
        }
        else
        require('../services/activateWalletCard')(token,cardName,req,res);
    });

    
}