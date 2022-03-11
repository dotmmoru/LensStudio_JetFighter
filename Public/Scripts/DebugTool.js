// -----JS CODE-----
//@input Component.ScriptComponent headController


var event = script.createEvent("TouchEndEvent");
event.bind(function (eventData) 
{
     script.headController.api.PlayAnim();
});
