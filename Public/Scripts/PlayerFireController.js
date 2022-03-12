// -----JS CODE-----
//@input Component.ScriptComponent[] rings
//@input float spawnDelay
//@input Component.ScriptComponent headController
//@input Component.ScriptComponent enemiesController

var timer = script.spawnDelay;
var isSpawning = true;

function InitRings()
{
    for(var j = 0;j<script.rings.length;j++)   
    {     
        script.rings[j].api.InitPosition();
        script.rings[j].api.SetMoving(false);
    } 
}

function Update(eventData)
{
    if (script.headController.api.GetGameEnabled() === true)
    {
        CoolDown(eventData);
    }
}

function CoolDown(eventData)
{
    if (isSpawning === false) return;
    
    timer-= eventData.getDeltaTime();
    if (timer<=0)
    {
        timer = script.spawnDelay;
        SpawnObj();
    }    
}

function SpawnObj()
{
   // print (script.headController.api.GetGameEnabled() );
    for(var j = 0;j<script.rings.length;j++)   
    {     
        if (script.rings[j].api.GetMoving() === false)
        {
            script.rings[j].api.InitRotation();
            script.rings[j].api.SetMoving(true);
            break;
        } 
    } 
}

script.api.GetCurrentEnemiesT = function () 
{
    return script.enemiesController.api.GetCurrentEnemiesT();
}

script.api.SetDamageToEnemie = function (id) 
{
    script.enemiesController.api.SetDamageToEnemie(id);
}

script.api.GotRing = function () 
{
    script.headController.api.PlayAnim();
    isSpawning = false;
    InitRings();
}

script.api.ReleaseGame = function () 
{   
    isSpawning = true;
}

var UpdateEvent = script.createEvent("UpdateEvent");
UpdateEvent.bind(Update);

InitRings();