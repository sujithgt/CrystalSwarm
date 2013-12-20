#pragma strict

var levelSpawner : LevelSpawner;
var inMainMenu : boolean = false;

var scoreText : GameObject[];
private var scoreValues : int[];
private var validCharacters : String = "_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";

private var inputManager : InputManager;
private var scoreInputDelay : float = .25f;

private var canFinish : boolean = false;

// player 1 score input variables
private var p1SI : boolean = false;
private var p1SIWave : int = 0;
private var p1SIScore : int = 0;
private var p1SIText : TextMesh = null;
private var p1SITextIndex : int = 0;
private var p1SIPosition : int = 0;
private var p1SICharacter : int = 0;
private var p1SIDelay : float = 0f;

// player 2 score input variables
private var p2SI : boolean = false;
private var p2SIWave : int = 0;
private var p2SIScore : int = 0;
private var p2SIText : TextMesh = null;
private var p2SITextIndex : int = 0;
private var p2SIPosition : int = 0;
private var p2SICharacter : int = 0;
private var p2SIDelay : float = 0f;

function Start()
{
	inputManager = GameObject.Find("GreenThrottleSingleton").GetComponent(InputManager);
	
	InitializeScores();
	
	enabled = false;
}

function Update()
{
	if( p1SI )
	{
		p1SI = UpdateP1Score();
	}
	if( p2SI )
	{
		p2SI = UpdateP2Score();
	}
	
	if( levelSpawner != null && !p1SI && !p2SI )
	{
		levelSpawner.EndAnnounce();
		enabled = false;
	}
}

function Show()
{
	for( var i : int = 0 ; i < scoreText.Length ; ++i )
	{
		scoreText[i].renderer.enabled = true;
	}
}

function ShowMenu()
{
	Show();
}

function HideMenu()
{
	for( var i : int = 0 ; i < scoreText.Length ; ++i )
	{
		scoreText[i].renderer.enabled = false;
	}
}

function AllowFinish()
{
	canFinish = true;
	enabled = true;
}

function IsHighScore( score : int ) : boolean
{
	return (score > scoreValues[ scoreValues.Length - 1 ]);
}

function AddHighScore( player : int, wave : int, score : int )
{
	var i : int = scoreValues.Length - 1;

	while( i > 0 )
	{
		if( score > scoreValues[i-1] )
		{
			scoreValues[i] = scoreValues[i-1];
			scoreText[i].GetComponent(TextMesh).text = scoreText[i-1].GetComponent(TextMesh).text;
			--i;
		}
		else
		{
			break;
		}
	}

	if( player == 1 )
	{
		scoreValues[i] = score;
		p1SI = true;
		p1SIWave = wave;
		p1SIScore = score;
		p1SIText = scoreText[i].GetComponent(TextMesh);
		p1SIText.text = GetScoreText( "___", wave, score );
		p1SITextIndex = i;
		p1SIPosition = 0;
		p1SICharacter = 0;
		p1SIDelay = scoreInputDelay;
	}
	else
	{
		scoreValues[i] = score;
		p2SI = true;
		p2SIWave = wave;
		p2SIScore = score;
		p2SIText = scoreText[i].GetComponent(TextMesh);
		p2SIText.text = GetScoreText( "___", wave, score );
		p2SITextIndex = i;
		p2SIPosition = 0;
		p2SICharacter = 0;
		p2SIDelay = scoreInputDelay;
	}
}

private function GetScoreText( name : String, wave : int, score : int ) : String
{
	return name + "   " + wave + "   " + score;
}

private function InitializeScores()
{
	if( !PlayerPrefs.HasKey("HSScore0") )
	{
		GenerateScores();
	}

	scoreValues = new int[scoreText.Length];

	var startHeight = inMainMenu ? -5f : -15f;	
	for( var i : int = 0 ; i < scoreText.Length ; ++i )
	{
		scoreText[i].transform.localPosition = Vector3(4f + (i < 5 ? -2.2f * Globals.levelxBounds : 0f),startHeight - (5f * (i % 5)),0f);
		scoreValues[i] = PlayerPrefs.GetInt("HSScore" + i);
		scoreText[i].GetComponent(TextMesh).text = GetScoreText(PlayerPrefs.GetString("HSName" + i), PlayerPrefs.GetInt("HSWave" + i), scoreValues[i]);
	}
}

private function GenerateScores()
{
	PlayerPrefs.SetString("HSName0", "ABC");
	PlayerPrefs.SetInt("HSWave0", 10);
	PlayerPrefs.SetInt("HSScore0", 100000);

	PlayerPrefs.SetString("HSName1", "BCD");
	PlayerPrefs.SetInt("HSWave1", 9);
	PlayerPrefs.SetInt("HSScore1", 50000);

	PlayerPrefs.SetString("HSName2", "CDE");
	PlayerPrefs.SetInt("HSWave2", 8);
	PlayerPrefs.SetInt("HSScore2", 25000);

	PlayerPrefs.SetString("HSName3", "DEF");
	PlayerPrefs.SetInt("HSWave3", 7);
	PlayerPrefs.SetInt("HSScore3", 15000);

	PlayerPrefs.SetString("HSName4", "EFG");
	PlayerPrefs.SetInt("HSWave4", 6);
	PlayerPrefs.SetInt("HSScore4", 10000);

	PlayerPrefs.SetString("HSName5", "FGH");
	PlayerPrefs.SetInt("HSWave5", 5);
	PlayerPrefs.SetInt("HSScore5", 8000);

	PlayerPrefs.SetString("HSName6", "GHI");
	PlayerPrefs.SetInt("HSWave6", 4);
	PlayerPrefs.SetInt("HSScore6", 6000);

	PlayerPrefs.SetString("HSName7", "HIJ");
	PlayerPrefs.SetInt("HSWave7", 3);
	PlayerPrefs.SetInt("HSScore7", 4000);

	PlayerPrefs.SetString("HSName8", "IJK");
	PlayerPrefs.SetInt("HSWave8", 2);
	PlayerPrefs.SetInt("HSScore8", 2000);

	PlayerPrefs.SetString("HSName9", "JKL");
	PlayerPrefs.SetInt("HSWave9", 1);
	PlayerPrefs.SetInt("HSScore9", 500);
	
	PlayerPrefs.Save();
}

private function UpdateP1Score()
{
	p1SIDelay -= Time.deltaTime;
	
	if( Mathf.Abs(Input.GetAxis("P1Y")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_Y, 1)) < .2f
	 && Mathf.Abs(Input.GetAxis("P1X")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_X, 1)) < .2f
	 && Mathf.Abs(Input.GetAxis("P1FireX")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_FIREX, 1)) < .2f
	 && Mathf.Abs(Input.GetAxis("P1FireY")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_FIREY, 1)) < .2f)
	{
		if( p1SIDelay >= 0f )
		{
			p1SIDelay = 0f;
		}
	}
	
	if( p1SIDelay <= 0f )
	{
		if( Mathf.Abs(Input.GetAxis("P1Y")) > .2f || Mathf.Abs(inputManager.GetAxis(InputManager.IA_Y,1)) > .2f )
		{
			if( Input.GetAxis("P1Y") > .2f || inputManager.GetAxis(InputManager.IA_Y, 1) > .2f )
			{
				--p1SICharacter;
				if( p1SICharacter < 0 )
				{
					p1SICharacter = validCharacters.Length-1;
				}
			}
			else
			{
				++p1SICharacter;
				if( p1SICharacter >= validCharacters.Length )
				{
					p1SICharacter = 0;
				}
			}
			p1SIText.text = SwapCharacter(p1SIText.text, p1SIPosition, validCharacters[p1SICharacter]);
			p1SIDelay = scoreInputDelay;
		}
		if( Mathf.Abs(Input.GetAxis("P1X")) > .2f || Mathf.Abs(inputManager.GetAxis(InputManager.IA_X,1)) > .2f )
		{
			p1SIText.text = SwapCharacter(p1SIText.text, p1SIPosition, validCharacters[p1SICharacter]);
			if( (Input.GetAxis("P1X") > .2f || inputManager.GetAxis(InputManager.IA_X, 1) > .2f) )
			{
				if( p1SIPosition > 0 )
				{
					--p1SIPosition;
				}
			}
			else if( p1SIPosition < 2 )
			{
				++p1SIPosition;
			}
			
			p1SICharacter = validCharacters.IndexOf(p1SIText.text[p1SIPosition]);
			p1SIDelay = scoreInputDelay;
		}
		if( canFinish && (((Mathf.Abs(Input.GetAxis("P1FireX")) > .2f) || (Mathf.Abs(Input.GetAxis("P1FireY")) > .2f) || inputManager.GetKey(InputManager.IB_FIRE, 1))) )
		{
			p1SIText.text = SwapCharacter(p1SIText.text, p1SIPosition, validCharacters[p1SICharacter]);
	
			if( p1SIPosition == 2 )
			{
				PlayerPrefs.SetString("HSName" + p1SITextIndex, p1SIText.text.Substring(0,3));
				PlayerPrefs.SetInt("HSWave" + p1SITextIndex, p1SIWave);
				PlayerPrefs.SetInt("HSScore" + p1SITextIndex, p1SIScore);
				PlayerPrefs.Save();
				return false;
			}
			else
			{
				++p1SIPosition;
				p1SIDelay = 2 * scoreInputDelay;
			}
		}
		
		var delayTime : int = p1SIDelay * -2f;
		if( delayTime > 0 && (delayTime % 2 == 0) )
		{
			p1SIText.text = SwapCharacter(p1SIText.text, p1SIPosition, " "[0]);
		}
		else
		{
			p1SIText.text = SwapCharacter(p1SIText.text, p1SIPosition, validCharacters[p1SICharacter]);
		}
	}
	
	return true;
}

private function UpdateP2Score()
{
	p2SIDelay -= Time.deltaTime;
	
	if( Mathf.Abs(Input.GetAxis("P2Y")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_Y, 2)) < .2f
	 && Mathf.Abs(Input.GetAxis("P2X")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_X, 2)) < .2f
	 && Mathf.Abs(Input.GetAxis("P2FireX")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_FIREX, 2)) < .2f
	 && Mathf.Abs(Input.GetAxis("P2FireY")) < .2f && Mathf.Abs(inputManager.GetAxis(InputManager.IA_FIREY, 2)) < .2f)
	{
		if( p2SIDelay >= 0f )
		{
			p2SIDelay = 0f;
		}
	}
	
	if( p2SIDelay <= 0f )
	{
		if( Mathf.Abs(Input.GetAxis("P2Y")) > .2f || Mathf.Abs(inputManager.GetAxis(InputManager.IA_Y,2)) > .2f )
		{
			if( Input.GetAxis("P2Y") > .2f || inputManager.GetAxis(InputManager.IA_Y, 2) > .2f )
			{
				--p2SICharacter;
				if( p2SICharacter < 0 )
				{
					p2SICharacter = validCharacters.Length-1;
				}
			}
			else
			{
				++p2SICharacter;
				if( p2SICharacter >= validCharacters.Length )
				{
					p2SICharacter = 0;
				}
			}
			p2SIText.text = SwapCharacter(p2SIText.text, p2SIPosition, validCharacters[p2SICharacter]);
			p2SIDelay = scoreInputDelay;
		}
		if( Mathf.Abs(Input.GetAxis("P2X")) > .2f || Mathf.Abs(inputManager.GetAxis(InputManager.IA_X,2)) > .2f )
		{
			p2SIText.text = SwapCharacter(p2SIText.text, p2SIPosition, validCharacters[p2SICharacter]);
			if( (Input.GetAxis("P2X") > .2f || inputManager.GetAxis(InputManager.IA_X, 2) > .2f) )
			{
				if( p2SIPosition > 0 )
				{
					--p2SIPosition;
				}
			}
			else if( p2SIPosition < 2 )
			{
				++p2SIPosition;
			}
			
			p2SICharacter = validCharacters.IndexOf(p2SIText.text[p2SIPosition]);
			p2SIDelay = scoreInputDelay;
		}
		if( canFinish && (((Mathf.Abs(Input.GetAxis("P2FireX")) > .2f) || (Mathf.Abs(Input.GetAxis("P2FireY")) > .2f) || inputManager.GetKey(InputManager.IB_FIRE, 2))) )
		{
			p2SIText.text = SwapCharacter(p2SIText.text, p2SIPosition, validCharacters[p2SICharacter]);
			
			if( p2SIPosition == 2 )
			{
				PlayerPrefs.SetString("HSName" + p2SITextIndex, p2SIText.text.Substring(0,3));
				PlayerPrefs.SetInt("HSWave" + p2SITextIndex, p2SIWave);
				PlayerPrefs.SetInt("HSScore" + p2SITextIndex, p2SIScore);
				PlayerPrefs.Save();
				return false;
			}
			else
			{
				++p2SIPosition;
				p2SIDelay = 2 * scoreInputDelay;
			}
		}
		
		var delayTime : int = p2SIDelay * -2f;
		if( delayTime > 0 && (delayTime % 2 == 0) )
		{
			p2SIText.text = SwapCharacter(p2SIText.text, p2SIPosition, " "[0]);
		}
		else
		{
			p2SIText.text = SwapCharacter(p2SIText.text, p2SIPosition, validCharacters[p2SICharacter]);
		}
	}
	
	return true;
}

private function SwapCharacter( str : String, ind : int, ch : char ) : String
{
	str = str.Remove(ind,1);
	str = str.Insert(ind,ch.ToString());
	return str;
}