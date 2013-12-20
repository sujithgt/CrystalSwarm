#pragma strict

var includeScore : boolean = true;
var scoreText : TextMesh;

var parent : GameObject;

var validCharacters : String = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";

private var inputManager : InputManager;
private var scoreInputDelay : float = .25f;

private var player : int;
private var wave : int = 0;
private var score : int = 0;
private var index : int = 0;
private var position : int = 0;
private var character : int = 0;
private var delay : float = 0f;

function Awake()
{
	inputManager = InputManager.Instance;
}

function StartTextInput( pl : int, wv : int, sc : int )
{
	player = pl;
	wave = wv;
	score = sc;
	scoreText.text = GetScoreText( "001", wave, score );
	position = 0;
	character = validCharacters.IndexOf(scoreText.text[position]);;
	delay = scoreInputDelay;
	enabled = true;
}

function Update()
{
	delay -= Time.deltaTime;
	
	if( Mathf.Abs(Input.GetAxis("P"+player+"Y")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_Y, player)) < .2f
	 && Mathf.Abs(Input.GetAxis("P"+player+"X")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_X, player)) < .2f
	 && Mathf.Abs(Input.GetAxis("P"+player+"FireX")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_FIREX, player)) < .2f
	 && Mathf.Abs(Input.GetAxis("P"+player+"FireY")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_FIREY, player)) < .2f)
	{
		if( delay >= 0f )
		{
			delay = 0f;
		}
	}
	
	if( delay <= 0f )
	{
		if( Mathf.Abs(Input.GetAxis("P"+player+"Y")) > .2f || Mathf.Abs(inputManager.GetAxis(InputManager.IA_Y,player)) > .2f )
		{
			if( Input.GetAxis("P"+player+"Y") > .2f || inputManager.GetAxis(InputManager.IA_Y, player) > .2f )
			{
				--character;
				if( character < 0 )
				{
					character = validCharacters.Length-1;
				}
			}
			else
			{
				++character;
				if( character >= validCharacters.Length )
				{
					character = 0;
				}
			}
			scoreText.text = SwapCharacter(scoreText.text, position, validCharacters[character]);
			delay = scoreInputDelay;
		}
		if( Mathf.Abs(Input.GetAxis("P"+player+"X")) > .2f || Mathf.Abs(inputManager.GetAxis(InputManager.IA_X,player)) > .2f )
		{
			scoreText.text = SwapCharacter(scoreText.text, position, validCharacters[character]);
			if( (Input.GetAxis("P"+player+"X") > .2f || inputManager.GetAxis(InputManager.IA_X, player) > .2f) )
			{
				if( position > 0 )
				{
					--position;
				}
			}
			else if( position < 2 )
			{
				++position;
			}
			
			character = validCharacters.IndexOf(scoreText.text[position]);
			delay = scoreInputDelay;
		}
		if( Mathf.Abs(Input.GetAxis("P"+player+"FireX")) > .2f || Mathf.Abs(Input.GetAxis("P"+player+"FireY")) > .2f || inputManager.GetKey(InputManager.IB_MENUFORWARD, player) )
		{
			scoreText.text = SwapCharacter(scoreText.text, position, validCharacters[character]);
	
			if( position == 2 )
			{
				parent.SendMessage("NameInputFinished", player);
				enabled = false;
			}
			else
			{
				++position;
				delay = 2 * scoreInputDelay;
			}
		}
	}
	
	if( enabled )
	{
		var delayTime : int = delay * -2f;
		if( (delay > .15f) || ((delayTime > 0) && (delayTime % 2 == 0)) )
		{
			scoreText.text = SwapCharacter(scoreText.text, position, " "[0]);
		}
		else
		{
			scoreText.text = SwapCharacter(scoreText.text, position, validCharacters[character]);
		}
	}

	if( Input.GetKeyDown(KeyCode.Escape) || inputManager.GetKeyPressed(InputManager.IB_SELECT) || inputManager.GetKeyPressed(InputManager.IB_MENUBACKWARD) )
	{
		parent.SendMessage("NameInputCancelled", player);
	}
}

function GetName() : String
{
	return scoreText.text.Substring(0,3);
}

private function GetScoreText( name : String, wave : int, score : int ) : String
{
	if( includeScore )
	{
		return name + "   " + wave + "   " + score;
	}
	return name;
}

private function SwapCharacter( str : String, ind : int, ch : char ) : String
{
	str = str.Remove(ind,1);
	str = str.Insert(ind,ch.ToString());
	return str;
}
