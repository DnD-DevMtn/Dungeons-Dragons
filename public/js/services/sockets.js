export default function($rootScope){

    const socket = io.connect();

    return {
        on: function(eventName, callback){
            socket.on(eventName, () => {
                const args = arguments;
                $rootScope.$apply(() => {
                    callback.apply(socket, args);
                });
            });
        }

        , emit: function(eventName, data, callback){
            socket.emit(eventName, data, () => {
                const args = arguments;
                $rootScope.$apply(() => {
                    if(callback){
                        callback.apply(socket, args);
                    }
                });
            });
        }
    }
}
