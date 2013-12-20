using UnityEngine;
using UnityEditor;
using System.Collections;

public class CreateAnimationTileset : ScriptableWizard
{
	public string folderName = "folder";
	public string fileName = "default";
    public int widthSegments = 1;
    public int heightSegments = 1;
    public float width = 10.0f;
    public float length = 10.0f;
	public int startFrame = 0;
	public int endFrame = 0;

    [MenuItem("GameObject/Create Other/Custom Animation Frames...")]
    static void CreateWizard()
    {
        ScriptableWizard.DisplayWizard("Create Tileset",typeof(CreateAnimationTileset));
    }
   
   
    void OnWizardUpdate()
    {
        widthSegments = Mathf.Clamp(widthSegments, 1, 256);
        heightSegments = Mathf.Clamp(heightSegments, 1, 256);
    }
   
    void OnWizardCreate()
    {
		AssetDatabase.CreateFolder("Assets/Editor", folderName);

		for( int h = 0 ; h < heightSegments ; ++h )
		{
			for( int w = 0 ; w < widthSegments ; ++w )
			{
				int planeNumber = w + h*widthSegments;
				
				if( (planeNumber >= startFrame) && ((endFrame == 0) || (planeNumber <= endFrame)) )
				{
					string planeAssetNumber = "" + (planeNumber);
					string planeAssetName = fileName + "_" + planeAssetNumber + ".asset";
					
					Mesh m = (Mesh)AssetDatabase.LoadAssetAtPath("Assets/Meshes/" + planeAssetName,typeof(Mesh));
					
					if( m == null)
					{
						m = new Mesh();
						m.name = planeAssetName;
	
						Vector3[] vertices = new Vector3[4];
						Vector2[] uvs = new Vector2[4];
						int[] triangles = new int[6];
						
						float uBegin = w * (1f / widthSegments);
						float uEnd = (1 + w) * (1f / widthSegments);
						float vBegin = (heightSegments - (1 + h)) * (1f / heightSegments);
						float vEnd = (heightSegments - h) * (1f / heightSegments);
	
						vertices[0] = new Vector3(-width * .5f, 0.0f, -length * .5f);
						uvs[0] = new Vector2(uEnd, vEnd);
						vertices[1] = new Vector3(width * .5f, 0.0f, -length * .5f);
						uvs[1] = new Vector2(uBegin, vEnd);
						vertices[2] = new Vector3(-width * .5f, 0.0f, length * .5f);
						uvs[2] = new Vector2(uEnd, vBegin);
						vertices[3] = new Vector3(width * .5f, 0.0f, length * .5f);
						uvs[3] = new Vector2(uBegin, vBegin);
						
						triangles[0] = 0;
						triangles[1] = 2;
						triangles[2] = 1;
						triangles[3] = 2;
						triangles[4] = 3;
						triangles[5] = 1;
						
						m.vertices = vertices;
						m.uv = uvs;
						m.triangles = triangles;
						m.RecalculateNormals();
						
						AssetDatabase.CreateAsset(m, "Assets/Editor/" + folderName + "/" + planeAssetName);
						AssetDatabase.SaveAssets();
					}
	
					m.RecalculateBounds();
				}
			}
		}
	}
}
