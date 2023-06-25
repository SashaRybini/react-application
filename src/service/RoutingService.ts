export default class RoutingService {
    
    static _user: string
    
    constructor(_user: string) {

    }
    get user() {
        
        return RoutingService._user
    }   
    
    static setUser(name: string) {
        
        RoutingService._user = name

        console.log(RoutingService._user);
        
    }

    isAdminSignedIn(): boolean {
        console.log(RoutingService._user);
        
        // return RoutingService._user.startsWith('admin')
        return true
    }
}

