// -----JS CODE---
//@input float yMin
//@input float yMax
//@input float xMin
//@input float xMax
//@input SceneObject razorGame
//@input Component.ScriptComponent ringsController
//@input float speed = 0.25

//@input float xCollision = 0.45
//@input float yCollision = 0.3


var transform = script.getSceneObject().getTransform();
var isMoving = false;

function getRndValue(v1,v2,v3,v4)
{
    if (getRandomInt(2) == 0)
    {
        return getRandomFloat(v1,v2)     
    }else 
    {
        return getRandomFloat(v3,v4) 
    } 
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomFloat(min,max) 
{
  return (Math.random() * (max - min) + min);
}

function Move()
{
    if (isMoving === false)
        return;
    
    var Pos = transform.getLocalPosition();
    
    if (Pos.y <= script.yMin)
    {
        InitBasePosition(); 
        isMoving = false;
        
        return;
    }
    transform.setLocalPosition(
    new vec3(Pos.x,Pos.y - script.speed,Pos.z));   
    
    CheckCollision();
}

function CheckCollision()
{
    var Pos = transform.getLocalPosition();
    var razorPos = script.razorGame.getTransform().getLocalPosition();
    if (Math.abs(razorPos.x - Pos.x)< script.xCollision)
    {
        if (Math.abs(razorPos.y - Pos.y)<script.yCollision)
        {
            print("Got a ring");
            SelfDisable(0.3);
        }
    }   
}

function SelfDisable(value)
{
    delaySelfDisable.reset(value);
}

function InitBasePosition()
{
    var Pos = transform.getLocalPosition();
    var x = getRandomFloat(script.xMin,script.xMax);
    transform.setLocalPosition(new vec3(x,script.yMax,Pos.z));
}

var delaySelfDisable = script.createEvent("DelayedCallbackEvent");
delaySelfDisable.bind(function (eventData)
{
   InitBasePosition(); 
    isMoving = false;
   script.ringsController.api.GotRing();
});

script.api.SetMoving = function (value) 
{
    isMoving = value;
}
script.api.GetMoving = function () 
{
    return isMoving;
}

script.api.InitPosition = function () 
{
    InitBasePosition();    
}

script.api.InitRotation = function () 
{

    InitBasePosition();  

}

function Update(eventData)
{
    Move();
}
var UpdateEvent = script.createEvent("UpdateEvent");
UpdateEvent.bind(Update);
