using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class PJMove : MonoBehaviour {
    [Header("Configurações de Pulo (UX)")]
    public float jumpForce = 10f;
    public float fallMultiplier = 2.5f;
    public float lowJumpMultiplier = 2f;
    
    [Header("Detecção de Chão")]
    public Transform groundCheck;
    public float checkRadius = 0.2f;
    public LayerMask groundLayer;
    
    private Rigidbody2D rb;
    private bool isGrounded;
    private bool jumpRequest;

    void Start() {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update() {
        isGrounded = Physics2D.OverlapCircle(groundCheck.position, checkRadius, groundLayer);

        if (Input.GetKeyDown(KeyCode.Space) && isGrounded) {
            jumpRequest = true;
        }

        // UX: Melhorar a sensação de gravidade (Cair mais rápido que subir)
        if (rb.linearVelocity.y < 0) {
            rb.linearVelocity += Vector2.up * Physics2D.gravity.y * (fallMultiplier - 1) * Time.deltaTime;
        } else if (rb.linearVelocity.y > 0 && !Input.GetKey(KeyCode.Space)) {
            rb.linearVelocity += Vector2.up * Physics2D.gravity.y * (lowJumpMultiplier - 1) * Time.deltaTime;
        }
    }

    void FixedUpdate() {
        if (jumpRequest) {
            rb.linearVelocity = new Vector2(rb.linearVelocity.x, 0); // Reseta velocidade Y para pulo consistente
            rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
            jumpRequest = false;
        }
    }
}

