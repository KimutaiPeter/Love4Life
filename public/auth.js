function get_auth() {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
        console.log(token);
    });

    chrome.identity.getProfileUserInfo(function(userinfo){
        console.log("userinfo",userinfo);
        email=userinfo.email;
        uniqueId=userinfo.id;
      });
}

function get_access_token() {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log(token);
            resolve(token)
        });
    })
}


function get_email(){
    return new Promise((resolve,reject)=>{
        chrome.identity.getProfileUserInfo(function(userinfo){
            console.log("userinfo",userinfo);
            resolve(userinfo)
          });
    })
}

function getToken(){
    return new Promise((resolve,reject)=>{
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            //console.log(token);
            resolve(token)
        });
    })
}


async function get_acc_info() {
    var token = await get_access_token()
    console.log(token)

    
    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data=> {
            console.log('User email:', data);
            // You can now use the user's email address as needed
        })
        .catch(error => {
            console.error('Error fetching user information:', error);
        });
}
