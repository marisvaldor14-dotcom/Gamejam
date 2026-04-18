using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(Collider2D))]
public class PJMove : MonoBehaviour {
    [Header("Configurações de Pulo (UX)")]
    public float jumpForce = 10f;
    public float fallMultiplier = 2.5f;
    public float lowJumpMultiplier = 2f;
    
    [Header("Detecção de Chão Automática")]
    public float rayLength = 0.1f;
    public LayerMask groundLayer;
    
    private Rigidbody2D rb;
    private Collider2D coll;
    private bool isGrounded;
    private bool jumpRequest;

    void Start() {
        rb = GetComponent<Rigidbody2D>();
        coll = GetComponent<Collider2D>();
        
        // Se nenhuma layer foi selecionada no Inspector, tenta pular em tudo que tiver colisor
        if (groundLayer.value == 0) {
            Debug.LogWarning("Ground Layer não definida. O personagem pulará em qualquer objeto físico.");
            groundLayer = Physics2D.AllLayers;
        }
    }

    void Update() {
        // Detecção de chão automática usando o tamanho do colisor
        Vector2 rayStart = new Vector2(coll.bounds.center.x, coll.bounds.min.y);
        RaycastHit2D hit = Physics2D.Raycast(rayStart, Vector2.down, rayLength, groundLayer);
        isGrounded = hit.collider != null;

        // Visualização do raio no Editor (aparece na aba Scene)
        Debug.DrawRay(rayStart, Vector2.down * rayLength, isGrounded ? Color.green : Color.red);

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


