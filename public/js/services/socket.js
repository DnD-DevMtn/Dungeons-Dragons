export default function($rootScope){

    const socket = io.connect();

    return {
        on: function(eventName, callback){
            socket.on(eventName, function(){
                const args = arguments;
                $rootScope.$apply(function(){
                    callback.apply(socket, args);
                });
            });
        }

        , emit: function(eventName, data, callback){
            socket.emit(eventName, data, function(){
                const args = arguments;
                $rootScope.$apply(function(){
                    if(callback){
                        callback.apply(socket, args);
                    }
                });
            });
        }
    }
}
