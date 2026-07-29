(function(global){
  'use strict';
  global.ADMIN_ACCESS_PASSWORD = '0123';
  global.AdminAccess = {
    sessionKey:'hystep.prototype.admin.authenticated',
    isAuthenticated(){return sessionStorage.getItem(this.sessionKey)==='true'},
    authenticate(password){const ok=password===global.ADMIN_ACCESS_PASSWORD;if(ok)sessionStorage.setItem(this.sessionKey,'true');return ok},
    logout(){sessionStorage.removeItem(this.sessionKey)}
  };
})(window);
