#pragma strict

static final var survivalSetup : SpawnEq[] =
	[
		SpawnEq(1, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 1.5f, 4f, 0f, 0f),
		SpawnEq(1, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 3f, 10f, 0f, 0f),

		SpawnEq(1, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 1f, 5f, -.5f, 0f),
		SpawnEq(1, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 2f, 10f, 0f, -5f),
		SpawnEq(1, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 10f, 20f, -3f, 0f),
		
		SpawnEq(2, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 0f, .5f, 2f),
		SpawnEq(2, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 0f, .5f, 2f),
		SpawnEq(2, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 0f, 2f, 4f),
		
		SpawnEq(5, true, Globals.TYPE_BLANK, 0, 0f, 0f, 0f, 0f),

		SpawnEq(5, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, .5f, 5f, 0f, 0f),
		SpawnEq(5, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 30f, 0f, -5f),
		SpawnEq(5, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 6f, 20f, -3f, 0f),

		SpawnEq(5, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, .5f, 5f, -.5f, 0f),
		SpawnEq(5, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 1f, 10f, 0f, -5f),
		SpawnEq(5, false, Globals.TYPE_COUNT, Globals.EN_NORM2, 4f, 20f, -1f, 0f)
	];