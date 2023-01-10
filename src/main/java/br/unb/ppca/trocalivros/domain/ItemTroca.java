package br.unb.ppca.trocalivros.domain;

import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItemTroca.
 */
@Entity
@Table(name = "item_troca")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItemTroca implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "id_global")
    private String idGlobal;

    @Enumerated(EnumType.STRING)
    @Column(name = "situacao")
    private SituacaoItem situacao;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "itemTrocas", "registroTrocas" }, allowSetters = true)
    private Troca troca;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItemTroca id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public ItemTroca nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getIdGlobal() {
        return this.idGlobal;
    }

    public ItemTroca idGlobal(String idGlobal) {
        this.setIdGlobal(idGlobal);
        return this;
    }

    public void setIdGlobal(String idGlobal) {
        this.idGlobal = idGlobal;
    }

    public SituacaoItem getSituacao() {
        return this.situacao;
    }

    public ItemTroca situacao(SituacaoItem situacao) {
        this.setSituacao(situacao);
        return this;
    }

    public void setSituacao(SituacaoItem situacao) {
        this.situacao = situacao;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ItemTroca user(User user) {
        this.setUser(user);
        return this;
    }

    public Troca getTroca() {
        return this.troca;
    }

    public void setTroca(Troca troca) {
        this.troca = troca;
    }

    public ItemTroca troca(Troca troca) {
        this.setTroca(troca);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItemTroca)) {
            return false;
        }
        return id != null && id.equals(((ItemTroca) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItemTroca{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", idGlobal='" + getIdGlobal() + "'" +
            ", situacao='" + getSituacao() + "'" +
            "}";
    }
}
