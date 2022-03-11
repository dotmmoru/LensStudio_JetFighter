// -----JS CODE-----
//@input SceneObject razerGame
//@input SceneObject razerGameMesh
//@input float leftBorder
//@input float rightBorder
//@input float razorSpeed = 0.1


var razerT = script.razerGame.getTransform();
var speedCoef = 0;
var speedMod = 0;
var speed = script.razorSpeed;



var isPlayingAnim = false;

script.api.UpdateSpeed = function (value, angle) {

    angle = Math.abs(angle);
    if (angle === 0)
        speedMod = 0;
    else if (angle >= 0.05 && angle < 0.15 )
        speedMod = 1;
    else if (angle >= 0.15 && angle < 0.3)
        speedMod = 1.5;
    else if (angle >= 0.3)
        speedMod = 2.0;


    if (speedCoef !== value) {

        switch (value) {
            case -1:
                {
                    global.tweenManager.stopTween(script.razerGameMesh, "rot_left_back");
                    global.tweenManager.stopTween(script.razerGameMesh, "rot_right_back");
                    global.tweenManager.stopTween(script.razerGameMesh, "rot_right_forward");

                    global.tweenManager.startTween(script.razerGameMesh, "rot_left_forward");
                    break;
                }
            case 0:
                {
                    global.tweenManager.stopTween(script.razerGameMesh, "rot_left_forward");
                    global.tweenManager.stopTween(script.razerGameMesh, "rot_right_forward");

                    if (script.razerGameMesh.getTransform().getLocalRotation().y < 0) {
                        global.tweenManager.startTween(script.razerGameMesh, "rot_left_back");
                    }
                    if (script.razerGameMesh.getTransform().getLocalRotation().y > 0) {
                        global.tweenManager.startTween(script.razerGameMesh, "rot_right_back");
                    }
                    break;
                }
            case 1:
                {
                    global.tweenManager.stopTween(script.razerGameMesh, "rot_left_back");
                    global.tweenManager.stopTween(script.razerGameMesh, "rot_right_back");

                    global.tweenManager.stopTween(script.razerGameMesh, "rot_left_forward");

                    global.tweenManager.startTween(script.razerGameMesh, "rot_right_forward");
                    break;
                }
        }
    }
    speedCoef = value; 
}

function Update(eventData)
{
    Move();
}

function Move()
{
    var razerTPos = razerT.getLocalPosition();
    //print (razerTPos.x)
    if (razerTPos.x <= script.leftBorder && speedCoef == -1)
        return;
    if ( razerTPos.x >= script.rightBorder && speedCoef == 1)
        return;
    
    razerT.setLocalPosition(
        new vec3(razerTPos.x + speed * speedCoef * speedMod,razerTPos.y,razerTPos.z));
    
}

var UpdateEvent = script.createEvent("UpdateEvent");
UpdateEvent.bind(Update);