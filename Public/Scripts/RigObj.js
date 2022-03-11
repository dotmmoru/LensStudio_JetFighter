// -----JS CODE-----
//@input SceneObject follower

var t = script.getSceneObject().getTransform();

var rt =  script.follower.getTransform();


// Bind the function printTime to the event UpdateEvent
var UpdateEvent = script.createEvent("UpdateEvent");
UpdateEvent.bind(UpdateTshirt);
function UpdateTshirt()
{ 
    t.setWorldPosition(rt.getWorldPosition());   
}