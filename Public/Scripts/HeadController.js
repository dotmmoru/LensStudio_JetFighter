// -----JS CODE-----
//@input Component.Head head;
//@input Component.ScriptComponent razerGameScript

//@input Component.ScriptComponent ringsController
//@input SceneObject startHint
//@input SceneObject secondHint
//@input SceneObject endGamePanel
//@input int maxScore
//@input Component.Text scoreTxt
//@input SceneObject scorePanel

//@input Component.AudioComponent ringAudio
//@input Component.AudioComponent victoryAudio
//@input Component.AudioComponent shavingAudio


//@input SceneObject beauty 


var isFaceTracking = false;
var isGameEnabled = false;
var isTrakingEnabled = false;
var score = 0;


script.api.PlayAnim = function () 
{
    if (isGameEnabled === false) return;    
    
    isGameEnabled = false;
    PlayRingAudio();
    
    // Play score bounce anim
    global.tweenManager.startTween( script.scorePanel, "update_score_tween" );  
    // Update score
    script.api.SetScore(score+1);  
    
  //  delayPlayExplosionAnim.reset(0.45);   

// REPLAY GAME
  //  delayReleaseGame.reset(3.2);
}

var delayReleaseGame = script.createEvent("DelayedCallbackEvent");
delayReleaseGame.bind(function (eventData)
{
    isGameEnabled = true;

    StopShavingAudio();
    script.ringsController.api.ReleaseGame();
});

function PlayRingAudio()
{
   // script.ringAudio.play(1);
}
function PlayVictoryAudio()
{
  //  script.victoryAudio.play(1);
}
function PlayShavingAudio()
{
 //   script.shavingAudio.play(1);
}
function StopShavingAudio()
{
  //  script.shavingAudio.stop(true);
}


script.api.GetGameEnabled = function () 
{
   return isGameEnabled;
}

script.api.SetScore = function (value) 
{
    score = value;

    script.scoreTxt.text = score+"/"+script.maxScore;
    
    if (script.maxScore == score)
    {
        delayGameOver.reset(3.5);
    }
}

script.api.GetScore = function () 
{
   return score;
}

script.api.ResetGame = function () 
{
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

 BeginGame();
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