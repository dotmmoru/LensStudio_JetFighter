// -----JS CODE-----
//@input Component.Head head;
//@input Component.ScriptComponent razerGameScript
//@input Component.ScriptComponent playerFireController
//@input Component.ScriptComponent ringsController
//@input SceneObject startHint
//@input SceneObject secondHint
//@input SceneObject endGamePanel
//@input int maxScore
//@input Component.Text scoreTxt
//@input Component.Text scoreFinalTxt
//@input SceneObject scorePanel

//@input Component.AudioComponent gameOverAudio
//@input Component.AudioComponent victoryAudio
//@input Component.AudioComponent startAudio

//@input SceneObject playerMesh
//@input Component.Image explosionSprite

//@input SceneObject beauty 


var isFaceTracking = false;
var isGameEnabled = false;
var isTrakingEnabled = false;
var score = 0;


script.api.PlayAnim = function () 
{
    if (isGameEnabled === false) return;    
    
    isGameEnabled = false;
    PlayGameOverAudio();
    
    // Play score bounce anim
    global.tweenManager.startTween( script.scorePanel, "update_score_tween" );  
    
    PlayExplosionAnimation();

    delay_disableMesh.reset(0.5);

// GAME OVER
    delayGameOver.reset(1);
}

function PlayExplosionAnimation()
{
    script.explosionSprite.enabled = true;
    var provider = script.explosionSprite.mainPass.baseTex.control;
    provider.play(1, 0);
}

var delay_disableMesh = script.createEvent("DelayedCallbackEvent");
delay_disableMesh.bind(function (eventData)
{
    script.playerMesh.enabled = false;
});

var delayReleaseGame = script.createEvent("DelayedCallbackEvent");
delayReleaseGame.bind(function (eventData)
{
    isGameEnabled = true;

    script.ringsController.api.ReleaseGame();
    script.playerFireController.api.ReleaseGame();
});

function PlayGameOverAudio()
{
   // script.gameOverAudio.play(1);
}
function PlayVictoryAudio()
{
  //  script.victoryAudio.play(1);
}


script.api.GetGameEnabled = function () 
{
   return isGameEnabled;
}

script.api.SetScore = function (value) 
{
    score = value;

    script.scoreTxt.text = score.toString();

    script.scoreFinalTxt.text = "Destroyed: \n" + score;
}

script.api.GetScore = function () 
{
   return score;
}

script.api.ResetGame = function () 
{
    script.startAudio.play(1);
    BeginGame(); 
}


function Update(eventData)
{

    if (isGameEnabled === false)
    {
        if (isTrakingEnabled === true)
        {
            HeadMoving();
        }    
        return;
    }  
    
    if (isFaceTracking === true)
    {
        
        if (script.head.getTransform().getLocalRotation().z > 0.05)
        {
              // move right
            script.razerGameScript.api.UpdateSpeed(-1, script.head.getTransform().getLocalRotation().z );
        }else 
        if (script.head.getTransform().getLocalRotation().z < -0.05)
        {
              // move left 
            script.razerGameScript.api.UpdateSpeed(1, script.head.getTransform().getLocalRotation().z);
        }else 
        {
            script.razerGameScript.api.UpdateSpeed(0,0);
        }
    }
}

function HeadMoving()
{   
   if (script.head.getTransform().getLocalRotation().z > 0.05 ||
       script.head.getTransform().getLocalRotation().z < -0.05)
   {
       isGameEnabled = true;
       isTrakingEnabled = false;
        // hide hint 2 
        script.secondHint.enabled = false;
   }
}

function BeginGame()
{  
    print ("Begin game");
    isGameEnabled = false;

    script.explosionSprite.enabled = false;
    script.playerMesh.enabled = true;

    global.tweenManager.startTween(script.beauty, "reset_beauty");

    script.scorePanel.enabled = false;
    script.endGamePanel.enabled = false;
    script.startHint.enabled = true;
    script.secondHint.enabled = false;
    
   // script.razerGame.enabled = true;
    script.api.SetScore(0);
    delayHide_StartHint.reset(3);
}

var delayHide_StartHint = script.createEvent("DelayedCallbackEvent");
delayHide_StartHint.bind(function (eventData)
{
    print ("delayHide_StartHint");
    script.startAudio.play(1);

   script.startHint.enabled = false; 
   delay_ShowSecondHint.reset(0.75);
});

var delay_ShowSecondHint = script.createEvent("DelayedCallbackEvent");
delay_ShowSecondHint.bind(function (eventData)
{
    script.secondHint.enabled = true;
    isTrakingEnabled = true;
    script.scorePanel.enabled = true;
   // delay_HideSecondHint.reset(3);
});
var delay_HideSecondHint = script.createEvent("DelayedCallbackEvent");
delay_HideSecondHint.bind(function (eventData)
{
    
});

var delayGameOver = script.createEvent("DelayedCallbackEvent");
delayGameOver.bind(function (eventData)
{
    isGameEnabled = false;
    PlayVictoryAudio();
    script.endGamePanel.enabled = true;
});


function onFaceFound()
{
   isFaceTracking = true;
  //
}
function onFaceLost()
{
   isFaceTracking = false;
}
var faceFoundEvent = script.createEvent("FaceFoundEvent");
faceFoundEvent.bind(onFaceFound);
var faceLostEvent = script.createEvent("FaceLostEvent");
faceLostEvent.bind(onFaceLost);
var UpdateEvent = script.createEvent("UpdateEvent");
UpdateEvent.bind(Update);

BeginGame();