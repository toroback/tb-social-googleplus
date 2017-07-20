let google      = require('googleapis');
let plus        = google.plus('v1');
let plusDomains = google.plusDomains('v1');
let OAuth2      = google.auth.OAuth2;
/**
 * Google Plus Adapter 
 * @class
 */
class Adapter{
  constructor(client){
    this.client  = client;
    this.options = {
      client_id     : client.options.clientId,
      client_secret : client.options.clientSecret,
      access_token  : client.options.accessToken,
      id_token      : client.options.idToken,
    }
    this.auth = new OAuth2(
      this.options.client_id,
      this.options.client_secret
    );
    this.auth.setCredentials({
      access_token : this.options.access_token,
      id_token     : this.options.id_token
    });  
  }

  //Solo funciona para cuentas con Dominio
  post(post){
    return new Promise((resolve,reject)=>{
      let message =  post.message + (post.link)? ` ${post.link}`: ''
        plusDomains.activities.insert({
          userId: 'me',
          auth: this.auth,
          activity:{
            "object": {
              "originalContent": message,
            },
            "access": {
              "items": [{
                  "type": "domain"
              }],
              "domainRestricted": false
            }
          }
        }, function (err, response) {
          if(err) reject(err);
          else resolve(response);
        })
    })
  }

  peopleGet(userId){
    return new Promise((resolve,reject)=>{
      plus.people.get({
        userId: userId,
        auth: this.auth
      }, function (err, response) {
        if(err) reject(err);
        else resolve(response);
      });
    })    
  }


}

module.exports = Adapter;