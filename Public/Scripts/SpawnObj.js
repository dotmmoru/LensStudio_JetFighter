// -----JS CODE---
//@input float yMin
//@input float yMax
//@input float xMin
//@input float xMax
//@input SceneObject razorGame
//@input Component.ScriptComponent ringsController
//@input Component.ScriptComponent bulletsController
//@input float speed = 0.25

//@input float xCollision = 0.45
//@input float yCollision = 0.3

//@input bool isBullet
//@input int health

//@input SceneObject playerMesh
//@input Component.Image explosionSprite

var aimT = script.razorGame.getTransform();
var transform = script.getSceneObject().getTransform();
var isMoving = false;

var baseHealth = script.health;

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
    
    var Pos = transform.getWorldPosition();
    
    if (Math.abs(Pos.y - script.yMin)<0.1)
    {
        InitBasePosition(); 
        isMoving = false;
        
        return;
    }
    transform.setWorldPosition(
    new vec3(Pos.x,Pos.y - script.speed,Pos.z));   
    
    CheckCollision();
}

function PlayExplosionAnimation()
{
    script.explosionSprite.enabled = true;
    var provider = script.explosionSprite.mainPass.baseTex.control;
    provider.play(1, 0);
}

function CheckCollision()
{
    var Pos = transform.getWorldPosition();
    if(script.isBullet === false)
    {
        var razorPos = script.razorGame.getTransform().getWorldPosition();
        if (Math.abs(razorPos.x - Pos.x)< script.xCollision)
        {
            if (Math.abs(razorPos.y - Pos.y)<script.yCollision)
            {
                // print("Collision with player");
                PlayExplosionAnimation();
                SelfDisable(0.5);
                PlayerDie();
            }
        }

        var listT = script.bulletsController.api.GetCurrentBulletsT();
        for (var i = listT.length - 1; i >= 0; i--) 
        {
            var lT = listT[i].getSceneObject().getTransform().getWorldPosition()
            if (Math.abs(lT.x - Pos.x) < script.xCollision)
            {
                if (Math.abs(lT.y - Pos.y) <script.yCollision)
                {
                   // print("TakeDamage");
                    TakeDamage();
                    listT[i].api.SetDisable();
                }
            }
        }
    }
}

function TakeDamage()
{
    script.health--;
    CheckHealth();
}

function CheckHealth() 
{
    if(script.health === 0)
    {
        PlayExplosionAnimation();
        SelfDisable(0.5);
        script.ringsController.api.IncreaseScore();
    }
}

function SelfDisable(value)
{
    delaySelfDisable.reset(value);
}

function InitBasePosition()
{
    if(script.isBullet === false)
        script.explosionSprite.enabled = false;

    var Pos = transform.getWorldPosition();

    if(script.isBullet === false)
    {
        var x = getRandomFloat(script.xMin,script.xMax);
        transform.setWorldPosition(new vec3(x,script.yMax,Pos.z));
    }else 
    {
        var x = aimT.getWorldPosition().x;
        transform.setWorldPosition(new vec3(x,script.yMax,Pos.z));
    }
}

function Shot()
{
   if(script.isBullet === true)
    {
        var Pos = transform.getWorldPosition();

        var x = aimT.getWorldPosition().x;
        var y = aimT.getWorldPosition().y;
        transform.setWorldPosition(new vec3(x,y,Pos.z));
    }
}

function PlayerDie() 
{
    script.ringsController.api.GotPlayerCollision();
}

var delaySelfDisable = script.createEvent("DelayedCallbackEvent");
delaySelfDisable.bind(function (eventData)
{
    script.health = baseHealth;
    InitBasePosition(); 
    isMoving = false;
});

script.api.SetDisable = function (value) 
{
    delaySelfDisable.reset(0);
}

script.api.SetMoving = function (value) 
{
    isMoving = value;

    if(value)
        Shot();
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
