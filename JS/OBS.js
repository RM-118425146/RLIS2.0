const obs = new OBSWebSocket(); 
window.connectToObs = async function(ip, port, password) {
    try {
        const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(`ws://${ip}:${port}`, `${password}`, { rpcVersion: 1 });
        console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
        console.log();
        document.getElementById("authText").innerHTML = ('Connected');
    } catch (error) {
        console.error('Failed to connect', error.code, error.message);
        document.getElementById("authText").innerHTML = ('Failed to connect');
    }
}

window.getSceneInfo = async function() {
    try {
        const {currentProgramSceneName} = await obs.call('GetCurrentProgramScene');
        console.log(`Current Program Scene is : ${currentProgramSceneName}`);
    } catch (error) {
        console.error('Failed to get info', error.code, error.message);
        document.getElementById("authText").innerHTML = ('Failed to get info');
    }
}

window.changeScene = async function(newSceneName) {
    try {
        await obs.call('SetCurrentProgramScene', {sceneName: newSceneName});
        const {currentProgramSceneName} = await obs.call('GetCurrentProgramScene');
        console.log(`Changed scene to : ${currentProgramSceneName}`);
    } catch (error) {
        console.error('Failed to get info', error.code, error.message);
        document.getElementById("authText").innerHTML = ('Failed to get info');
    }
}

window.disconnectObs = async function() {
    try {
        await obs.disconnect();
        console.log('Disconnected from OBS');
        document.getElementById("authText").innerHTML = ('Disconnected');
    } catch (error) {
        console.error('Failed to disconnect', error.code, error.message);
        document.getElementById("authText").innerHTML = ('Failed to disconnect');
    }
}