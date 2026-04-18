using UnityEngine;

public class CloudMover : MonoBehaviour {
    [Header("Configurações de Movimento")]
    public float speed = 2.0f;
    public float resetPositionX = -20f;
    public float startPositionX = 20f;
    
    [Header("UX: Efeito Paralaxe")]
    [Tooltip("Quanto maior, mais longe a nuvem parece estar")]
    public bool moveLeft = true;

    void Update() {
        float direction = moveLeft ? -1f : 1f;
        transform.Translate(Vector3.right * direction * speed * Time.deltaTime);

        // Lógica de loop infinito para o Runner
        if (moveLeft && transform.position.x <= resetPositionX) {
            Respawn();
        } else if (!moveLeft && transform.position.x >= startPositionX) {
            Respawn();
        }
    }

    void Respawn() {
        float side = moveLeft ? startPositionX : resetPositionX;
        transform.position = new Vector3(side, transform.position.y, transform.position.z);
    }
}
