using System;
using UnityEngine;

public class GroundController : MonoBehaviour {

    public Transform g1, g2, g3;
    public float velocidade;

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start() {
        
    }

    // Update is called once per frame
    void Update() {
        MoverElemento(g1);
        MoverElemento(g2);
        MoverElemento(g3);
    }

    private void MoverElemento(Transform gAtual) {
        gAtual.Translate(new Vector2 (-velocidade*Time.deltaTime, 0.0f));
        if(gAtual.position.x <= -32.0f) {
            gAtual.Translate(new Vector2(96.0f, 0.0f));
        }
    }
}
