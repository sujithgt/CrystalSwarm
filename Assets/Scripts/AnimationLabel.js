#pragma strict

var animName : String = "default";
var nextAnimName : String = "";
var frames : Mesh[];
var time : float = .25f;
var loop : boolean = true;

var rescale : boolean = false;
var frameScale : float[];

var destroyOnFinish : boolean = false;

var mat : Material = null;

var framesPerMap : int = 0;