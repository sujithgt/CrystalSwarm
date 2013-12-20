#pragma strict

static final var descentSetup : SpawnEq[] =
	[
		SpawnEq(1, true, Globals.TYPE_CUTSCENE, 0, 0f, 0f, 0f, 0f),
	
		SpawnEq(1, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 5f, 10f, 0f, 0f),
		SpawnEq(1, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 25f, 0f, 0f, 0f),
		SpawnEq(1, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 50f, 0f, 50f),

		SpawnEq(3, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 5f, 0f, 0f),

		SpawnEq(4, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 20f, -60f, 0f, 0f),

		SpawnEq(5, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 10f, 0f, 0f),
		SpawnEq(5, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 25f, 0f, 0f),
		SpawnEq(5, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 100f, 0f, 0f),
		SpawnEq(5, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 200f, 0f, 0f),
		
		SpawnEq(6, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),
		
		SpawnEq(6, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 4f, 0f, 0f),
		SpawnEq(6, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 10f, 0f, 0f),
		SpawnEq(6, true, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 12f, 0f, 0f),
		
		SpawnEq(6, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 6f, 0f, 0f),
		SpawnEq(6, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 24f, 0f, 0f),

		SpawnEq(7, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 10f, 0f, 0f),
		SpawnEq(7, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 25f, 0f, 0f),
		SpawnEq(7, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 70f, 0f, 0f),
		SpawnEq(7, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 30f, 0f, 0f),

		SpawnEq(8, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_DOUBLE, 0f, 1f, 0f, 0f),
		SpawnEq(8, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(8, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 2f, 0f, 0f),
		SpawnEq(8, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 150f, 0f, 0f),

		SpawnEq(9, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(9, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 10f, 0f, 0f),
		SpawnEq(9, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 40f, 0f, 0f),
		
		SpawnEq(10, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(10, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 0f, 0f, 0f),
		SpawnEq(10, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(10, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 100f, 0f, 0f),
		SpawnEq(10, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 25f, 0f, 0f),
		SpawnEq(10, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 30f, 0f, 0f),
		SpawnEq(10, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 180f, 0f, 0f),
		SpawnEq(10, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 10f, 0f, 0f),
		SpawnEq(10, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 60f, 0f, 0f),
		
		SpawnEq(11, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(11, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 3f, 0f, 0f),
		SpawnEq(11, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 6f, 0f, 0f),
		SpawnEq(11, true, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 9f, 0f, 0f),
		
		SpawnEq(11, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 4f, 0f, 0f),
		SpawnEq(11, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 14f, 0f, 0f),
		
		SpawnEq(12, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 15f, 0f, 0f),
		SpawnEq(12, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 25f, 0f, 0f),
		SpawnEq(12, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 90f, 0f, 0f),
		SpawnEq(12, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 10f, 0f, 0f),

		SpawnEq(13, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 0f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 4f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 24f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 25f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 35f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 275f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 20f, 0f, 0f),

		SpawnEq(14, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 0f, 0f, 0f),
		SpawnEq(13, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 0f, 0f, 0f),
		SpawnEq(14, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 0f, 0f, 0f),
		SpawnEq(14, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 6f, 0f, 0f),
		SpawnEq(14, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 10f, 0f, 0f),
		SpawnEq(14, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 30f, 0f, 0f),
		SpawnEq(14, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 3f, 0f, 0f),
		SpawnEq(14, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 14f, 0f, 0f),
		
		SpawnEq(15, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 10f, 0f, 0f),
		SpawnEq(15, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 6f, 0f, 0f),
		SpawnEq(15, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 12f, 0f, 0f),
		SpawnEq(15, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 42f, 0f, 0f),
		SpawnEq(15, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 4f, 0f, 0f),
		SpawnEq(15, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 18f, 0f, 0f),

		SpawnEq(16, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),
		
		SpawnEq(16, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 2f, 0f, 0f),
		SpawnEq(16, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(16, true, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 6f, 0f, 0f),

		SpawnEq(16, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(16, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 5f, 0f, 0f),
		SpawnEq(16, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 12f, 0f, 0f),
		
		SpawnEq(17, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 20f, 0f, 0f),
		SpawnEq(17, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 50f, 0f, 0f),
		SpawnEq(17, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 100f, 0f, 0f),
		SpawnEq(17, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 40f, 0f, 0f),

		SpawnEq(18, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 0f, 0f, 0f),
		SpawnEq(18, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 150f, 0f, 0f),
		SpawnEq(18, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_DOUBLE, 0f, 1f, 0f, 0f),
		SpawnEq(18, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(18, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 2f, 0f, 0f),
		SpawnEq(18, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 4f, 0f, 0f),
		SpawnEq(18, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 8f, 0f, 0f),
		SpawnEq(18, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 24f, 0f, 0f),

		SpawnEq(19, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 0f, 0f, 0f),
		SpawnEq(19, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(19, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(19, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 6f, 0f, 0f),
		SpawnEq(19, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 21f, 0f, 0f),
		SpawnEq(19, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 6f, 0f, 0f),
		SpawnEq(19, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 10f, 0f, 0f),
		SpawnEq(19, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 42f, 0f, 0f),

		SpawnEq(20, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 0f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 15f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 4f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 6f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 36f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 4f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 6f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 24f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 8f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 12f, 0f, 0f),
		SpawnEq(20, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 80f, 0f, 0f),

		SpawnEq(21, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(21, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 3f, 0f, 0f),
		SpawnEq(21, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(21, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(21, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 75f, 0f, 0f),
		SpawnEq(21, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 150f, 0f, 0f),
		SpawnEq(21, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 550f, 0f, 0f),

		SpawnEq(22, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(22, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 50f, 0f, 0f),
		SpawnEq(22, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 75f, 0f, 0f),
		SpawnEq(22, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 200f, 0f, 0f),
		SpawnEq(22, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 2f, 0f, 0f),
		SpawnEq(22, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 6f, 0f, 0f),
		SpawnEq(22, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 14f, 0f, 0f),

		SpawnEq(23, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 0f, 0f, 0f),
		SpawnEq(23, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(23, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 0f, 0f, 0f),
		SpawnEq(23, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 5f, 0f, 0f),
		SpawnEq(23, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 8f, 0f, 0f),
		SpawnEq(23, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 45f, 0f, 0f),
		SpawnEq(23, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 3f, 0f, 0f),
		SpawnEq(23, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 8f, 0f, 0f),
		SpawnEq(23, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 15f, 0f, 0f),

		SpawnEq(24, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(24, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 15f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 30f, 0f, 0f),
		SpawnEq(24, true, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 30f, 0f, 0f),

		SpawnEq(24, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 15f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_DOUBLE, 0f, 1f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(24, true, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 2f, 0f, 0f),
		
		SpawnEq(24, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 0f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 2f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 6f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 10f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 2f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 8f, 0f, 0f),
		SpawnEq(24, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 12f, 0f, 0f),

		SpawnEq(25, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 3f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 25f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 75f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 300f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 3f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 10f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 27f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 7f, 0f, 0f),
		SpawnEq(25, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 21f, 0f, 0f),

		SpawnEq(26, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),
		
		SpawnEq(26, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 2f, 0f, 0f),
		SpawnEq(26, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 6f, 0f, 0f),
		SpawnEq(26, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 16f, 0f, 0f),
		SpawnEq(26, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 15f, 0f, 0f),
		SpawnEq(26, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 50f, 0f, 0f),
		SpawnEq(26, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 165f, 0f, 0f),

		SpawnEq(27, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(27, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 60f, 0f, 0f),
		SpawnEq(27, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 5f, 0f, 0f),
		SpawnEq(27, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 8f, 0f, 0f),
		SpawnEq(27, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 35f, 0f, 0f),
		SpawnEq(27, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(27, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 5f, 0f, 0f),
		SpawnEq(27, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 15f, 0f, 0f),

		SpawnEq(28, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(28, false, Globals.TYPE_COUNT, Globals.EN_INVUL1, 0f, 15f, 0f, 0f),
		SpawnEq(28, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 15f, 0f, 0f),
		SpawnEq(28, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 30f, 0f, 0f),
		SpawnEq(28, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 75f, 0f, 0f),
		SpawnEq(28, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 3f, 0f, 0f),
		SpawnEq(28, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 6f, 0f, 0f),
		SpawnEq(28, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 18f, 0f, 0f),
		
		SpawnEq(29, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(29, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 2f, 0f, 0f),
		SpawnEq(29, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 5f, 0f, 0f),
		SpawnEq(29, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 12f, 0f, 0f),
		SpawnEq(29, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(29, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 5f, 0f, 0f),
		SpawnEq(29, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 21f, 0f, 0f),

		SpawnEq(30, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(30, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 16f, 0f, 0f),
		SpawnEq(30, false, Globals.TYPE_COUNT, Globals.EN_BOSS_BEE, 0f, 1f, 0f, 0f),

		SpawnEq(31, true, Globals.TYPE_CUTSCENE, 1, 0f, 0f, 0f, 0f),
		SpawnEq(31, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(31, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, 0f, 15f, 0f, 0f),
		SpawnEq(31, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 0f, 60f, 0f, 0f),
		SpawnEq(31, true, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 45f, 0f, 0f),

		SpawnEq(31, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(31, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(31, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(31, true, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 15f, 0f, 0f),

		SpawnEq(31, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, 0f, 40f, 0f, 0f),
		SpawnEq(31, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 0f, 150f, 0f, 0f),
		SpawnEq(31, false, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 280f, 0f, 0f),

		SpawnEq(32, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(32, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 20f, 0f, 0f),
		SpawnEq(32, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, 0f, 15f, 0f, 0f),
		SpawnEq(32, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 0f, 40f, 0f, 0f),
		SpawnEq(32, false, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 120f, 0f, 0f),

		SpawnEq(33, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 10f, 0f, 0f),
		SpawnEq(33, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, 0f, 5f, 0f, 0f),
		SpawnEq(33, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 0f, 25f, 0f, 0f),
		SpawnEq(33, false, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 35f, 0f, 0f),
		SpawnEq(33, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 2f, 0f, 0f),
		SpawnEq(33, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 5f, 0f, 0f),
		SpawnEq(33, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 12f, 0f, 0f),

		SpawnEq(34, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(34, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 15f, 0f, 0f),
		SpawnEq(34, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 2f, 0f, 0f),
		SpawnEq(34, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 6f, 0f, 0f),
		SpawnEq(34, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 10f, 0f, 0f),
		SpawnEq(34, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 4f, 0f, 0f),
		SpawnEq(34, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 6f, 0f, 0f),
		SpawnEq(34, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 24f, 0f, 0f),

		SpawnEq(35, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(35, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(35, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 0f, 0f, 0f),
		SpawnEq(35, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(34, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 20f, 0f, 0f),
		SpawnEq(35, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 2f, 0f, 0f),
		SpawnEq(35, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 8f, 0f, 0f),
		SpawnEq(35, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 12f, 0f, 0f),
		SpawnEq(35, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 4f, 0f, 0f),
		SpawnEq(35, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 8f, 0f, 0f),
		SpawnEq(35, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 26f, 0f, 0f),

		SpawnEq(36, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),
		
		SpawnEq(36, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 25f, 0f, 0f),
		SpawnEq(36, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 75f, 0f, 0f),
		SpawnEq(36, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 225f, 0f, 0f),
		SpawnEq(36, false, Globals.TYPE_SPAWN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(36, false, Globals.TYPE_SCREEN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(36, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),

		SpawnEq(37, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(37, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_DOUBLE, 0f, 1f, 0f, 0f),
		SpawnEq(37, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(37, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 2f, 0f, 0f),
		SpawnEq(37, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(37, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 4f, 0f, 0f),
		SpawnEq(37, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 18f, 0f, 0f),
		SpawnEq(37, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 2f, 0f, 0f),
		SpawnEq(37, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 5f, 0f, 0f),
		SpawnEq(37, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 20f, 0f, 0f),

		SpawnEq(38, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(38, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 0f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 5f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 24f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 4f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 7f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 36f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 5f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 8f, 0f, 0f),
		SpawnEq(38, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 60f, 0f, 0f),

		SpawnEq(39, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(39, false, Globals.TYPE_SPAWN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(39, false, Globals.TYPE_SCREEN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(39, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(39, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(39, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 8f, 0f, 0f),
		SpawnEq(39, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 27f, 0f, 0f),
		
		SpawnEq(40, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_TRIPLE, 0f, 1f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_TRIPLE, 0f, 0f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_TRIPLE, 0f, 2f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 0f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 40f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 5f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 8f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 35f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_SPAWN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_SCREEN, Globals.EN_HOMING2, 0f, 3f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 5f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 5f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 8f, 0f, 0f),
		SpawnEq(40, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 35f, 0f, 0f),

		SpawnEq(41, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(41, false, Globals.TYPE_SPAWN, Globals.EN_NORM1, 0f, 25f, 0f, 0f),
		SpawnEq(41, false, Globals.TYPE_SCREEN, Globals.EN_NORM1, 0f, 100f, 0f, 0f),
		SpawnEq(41, false, Globals.TYPE_COUNT, Globals.EN_NORM1, 0f, 150f, 0f, 0f),
		SpawnEq(41, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 4f, 0f, 0f),
		SpawnEq(41, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 6f, 0f, 0f),
		SpawnEq(41, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 30f, 0f, 0f),
		
		SpawnEq(42, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(42, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, 0f, 10f, 0f, 0f),
		SpawnEq(42, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 0f, 20f, 0f, 0f),
		SpawnEq(42, false, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 60f, 0f, 0f),
		SpawnEq(42, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 3f, 0f, 0f),
		SpawnEq(42, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 6f, 0f, 0f),
		SpawnEq(42, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 27f, 0f, 0f),
		SpawnEq(42, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 1f, 0f, 0f),
		SpawnEq(42, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 6f, 0f, 0f),
		SpawnEq(42, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 8f, 0f, 0f),

		SpawnEq(43, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(43, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, 0f, 15f, 0f, 0f),
		SpawnEq(43, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 0f, 75f, 0f, 0f),
		SpawnEq(43, false, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 75f, 0f, 0f),
		SpawnEq(43, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 4f, 0f, 0f),
		SpawnEq(43, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 8f, 0f, 0f),
		SpawnEq(43, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 32f, 0f, 0f),
		
		SpawnEq(44, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(44, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, 0f, 20f, 0f, 0f),
		SpawnEq(44, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 0f, 60f, 0f, 0f),
		SpawnEq(44, false, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 60f, 0f, 0f),
		SpawnEq(44, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 2f, 0f, 0f),
		SpawnEq(44, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 8f, 0f, 0f),
		SpawnEq(44, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 12f, 0f, 0f),
		
		SpawnEq(45, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(45, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 10f, 0f, 0f),
		SpawnEq(45, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 15f, 0f, 0f),
		SpawnEq(45, true, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 30f, 0f, 0f),

		SpawnEq(45, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 0f, 0f, 0f),
		SpawnEq(45, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 3f, 0f, 0f),
		SpawnEq(45, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 6f, 0f, 0f),
		SpawnEq(45, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 18f, 0f, 0f),

		SpawnEq(46, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),
		
		SpawnEq(46, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 15f, 0f, 0f),
		SpawnEq(46, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 10f, 0f, 0f),
		SpawnEq(46, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 3f, 0f, 0f),
		SpawnEq(46, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 6f, 0f, 0f),
		SpawnEq(46, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 21f, 0f, 0f),
		
		SpawnEq(47, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(47, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 15f, 0f, 0f),
		SpawnEq(47, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 5f, 0f, 0f),
		SpawnEq(47, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 8f, 0f, 0f),
		SpawnEq(47, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 32f, 0f, 0f),

		SpawnEq(48, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 50f, 0f, 0f),
		SpawnEq(48, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 4f, 0f, 0f),
		SpawnEq(48, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 6f, 0f, 0f),
		SpawnEq(48, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 28f, 0f, 0f),
		SpawnEq(48, false, Globals.TYPE_SPAWN, Globals.EN_NORM2, 0f, 10f, 0f, 0f),
		SpawnEq(48, false, Globals.TYPE_SCREEN, Globals.EN_NORM2, 0f, 40f, 0f, 0f),
		SpawnEq(48, false, Globals.TYPE_COUNT, Globals.EN_NORM2, 0f, 60f, 0f, 0f),

		SpawnEq(49, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(49, false, Globals.TYPE_COUNT, Globals.EN_POWERUP_DOUBLE, 0f, 1f, 0f, 0f),
		SpawnEq(49, false, Globals.TYPE_SCREEN, Globals.EN_POWERUP_DOUBLE, 0f, 0f, 0f, 0f),
		SpawnEq(49, false, Globals.TYPE_SPAWN, Globals.EN_POWERUP_DOUBLE, 0f, 2f, 0f, 0f),
		SpawnEq(49, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 40f, 0f, 0f),
		SpawnEq(49, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 3f, 0f, 0f),
		SpawnEq(49, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 6f, 0f, 0f),
		SpawnEq(49, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 21f, 0f, 0f),

		SpawnEq(50, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(50, false, Globals.TYPE_COUNT, Globals.EN_MINE1, 0f, 50f, 0f, 0f),
		SpawnEq(50, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 8f, 0f, 0f),
		SpawnEq(50, false, Globals.TYPE_SPAWN, Globals.EN_HOMING1, 0f, 3f, 0f, 0f),
		SpawnEq(50, false, Globals.TYPE_SCREEN, Globals.EN_HOMING1, 0f, 6f, 0f, 0f),
		SpawnEq(50, false, Globals.TYPE_COUNT, Globals.EN_HOMING1, 0f, 15f, 0f, 0f),
		SpawnEq(50, false, Globals.TYPE_SPAWN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(50, false, Globals.TYPE_SCREEN, Globals.EN_HOMING2, 0f, 2f, 0f, 0f),
		SpawnEq(50, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 3f, 0f, 0f),
		
		SpawnEq(51, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),
		
		SpawnEq(51, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 30f, 0f, 0f),
		SpawnEq(51, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 4f, 0f, 0f),
		SpawnEq(51, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 6f, 0f, 0f),
		SpawnEq(51, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 16f, 0f, 0f),

		SpawnEq(52, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 0f, 0f, 0f),
		SpawnEq(52, false, Globals.TYPE_SPAWN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(52, false, Globals.TYPE_SCREEN, Globals.EN_HOMING2, 0f, 2f, 0f, 0f),
		SpawnEq(52, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 2f, 0f, 0f),
		SpawnEq(52, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 3f, 0f, 0f),
		SpawnEq(52, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 6f, 0f, 0f),
		SpawnEq(52, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 24f, 0f, 0f),

		SpawnEq(53, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(53, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 10f, 0f, 0f),
		SpawnEq(53, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 2f, 0f, 0f),
		SpawnEq(53, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 4f, 0f, 0f),
		SpawnEq(53, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 16f, 0f, 0f),
		SpawnEq(53, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 2f, 0f, 0f),
		SpawnEq(53, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 6f, 0f, 0f),
		SpawnEq(53, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 14f, 0f, 0f),

		SpawnEq(54, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(54, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN1, 0f, 4f, 0f, 0f),
		SpawnEq(54, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN1, 0f, 4f, 0f, 0f),
		SpawnEq(54, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 8f, 0f, 0f),
		SpawnEq(54, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 2f, 0f, 0f),
		SpawnEq(54, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 6f, 0f, 0f),
		SpawnEq(54, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 16f, 0f, 0f),

		SpawnEq(55, false, Globals.TYPE_COUNT, Globals.EN_SPAWN1, 0f, 0f, 0f, 0f),
		SpawnEq(55, false, Globals.TYPE_SPAWN, Globals.EN_SPAWN2, 0f, 3f, 0f, 0f),
		SpawnEq(55, false, Globals.TYPE_SCREEN, Globals.EN_SPAWN2, 0f, 5f, 0f, 0f),
		SpawnEq(55, false, Globals.TYPE_COUNT, Globals.EN_SPAWN2, 0f, 24f, 0f, 0f),
		SpawnEq(55, false, Globals.TYPE_SPAWN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(55, false, Globals.TYPE_SCREEN, Globals.EN_HOMING2, 0f, 3f, 0f, 0f),
		SpawnEq(55, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 4f, 0f, 0f),
		
		SpawnEq(56, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(56, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 15f, 0f, 0f),
		SpawnEq(56, false, Globals.TYPE_SPAWN, Globals.EN_MINER1, 0f, 6f, 0f, 0f),
		SpawnEq(56, false, Globals.TYPE_SCREEN, Globals.EN_MINER1, 0f, 8f, 0f, 0f),
		SpawnEq(56, false, Globals.TYPE_COUNT, Globals.EN_MINER1, 0f, 54f, 0f, 0f),
		SpawnEq(56, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 2f, 0f, 0f),
		SpawnEq(56, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 6f, 0f, 0f),
		SpawnEq(56, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 24f, 0f, 0f),
		
		SpawnEq(57, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(57, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 15f, 0f, 0f),
		SpawnEq(57, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 20f, 0f, 0f),
		SpawnEq(57, false, Globals.TYPE_SPAWN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(57, false, Globals.TYPE_SCREEN, Globals.EN_HOMING2, 0f, 2f, 0f, 0f),
		SpawnEq(57, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 2f, 0f, 0f),
		
		SpawnEq(58, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 0f, 0f, 0f),
		SpawnEq(58, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 10f, 0f, 0f),
		SpawnEq(58, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 20f, 0f, 0f),
		SpawnEq(58, false, Globals.TYPE_SPAWN, Globals.EN_MINER2, 0f, 4f, 0f, 0f),
		SpawnEq(58, false, Globals.TYPE_SCREEN, Globals.EN_MINER2, 0f, 8f, 0f, 0f),
		SpawnEq(58, false, Globals.TYPE_COUNT, Globals.EN_MINER2, 0f, 44f, 0f, 0f),

		SpawnEq(59, false, Globals.TYPE_COUNT, Globals.EN_MINE2, 0f, 0f, 0f, 0f),
		SpawnEq(59, false, Globals.TYPE_COUNT, Globals.EN_INVUL2, 0f, 5f, 0f, 0f),
		SpawnEq(59, false, Globals.TYPE_SPAWN, Globals.EN_HOMING2, 0f, 1f, 0f, 0f),
		SpawnEq(59, false, Globals.TYPE_SCREEN, Globals.EN_HOMING2, 0f, 2f, 0f, 0f),
		SpawnEq(59, false, Globals.TYPE_COUNT, Globals.EN_HOMING2, 0f, 2f, 0f, 0f),
		
		SpawnEq(60, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f),

		SpawnEq(60, false, Globals.TYPE_COUNT, Globals.EN_BOSS_SCORPION, 0f, 1f, 0f, 0f),

		SpawnEq(61, true, Globals.TYPE_CUTSCENE, 2, 0f, 0f, 0f, 0f),

		//SpawnEq(61, true, Globals.TYPE_CUTSCENE, 3, 0f, 0f, 0f, 0f),
		
		SpawnEq(61, true, Globals.TYPE_EXIT, 0, 0f, 0f, 0f, 0f),
		SpawnEq(61, false, Globals.TYPE_CLEAR, 0, 0f, 0f, 0f, 0f)

	];

static final var descentLives : int[] = 
	[
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,1,0,0,0,0,2,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,1
	];

static final var descentEfficiency : float[] =
	[
		 65f, 70f, 65f, 75f, 75f, 75f, 65f, 40f, 65f, 40f,
		 90f, 75f, 45f, 70f, 60f,110f, 75f, 55f, 85f, 50f,
		 75f, 80f, 70f, 55f, 70f, 85f, 75f, 65f, 75f, 75f,
		 45f, 55f, 70f, 65f, 45f, 95f, 50f, 60f,100f, 55f,
		 75f, 70f, 55f, 65f, 75f, 80f, 70f, 55f, 40f, 80f,
		 70f, 90f, 70f, 85f, 90f, 60f, 85f, 55f, 70f,115f
	];

static final var descentTimes : int[] =
	[
		 20, 25, 15, 25, 45, 35, 30, 30, 35, 50,
		 40, 45, 65, 45, 65, 35, 45, 30, 55, 75,
		 50, 60, 55, 60, 65, 55, 45, 55, 60,130,
		 65, 45, 35, 45, 40, 45, 50, 60, 45, 70,
		 50, 45, 45, 40, 60, 45, 30, 45, 45, 60,
		 40, 55, 45, 40, 80, 55, 30, 55, 55,100
	];
