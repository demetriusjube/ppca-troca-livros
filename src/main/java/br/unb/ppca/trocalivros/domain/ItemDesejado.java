package br.unb.ppca.trocalivros.domain;

import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItemDesejado.
 */
@Entity
@Table(name = "item_desejado")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItemDesejado implements Serializable {

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

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItemDesejado id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public ItemDesejado nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getIdGlobal() {
        return this.idGlobal;
    }

    public ItemDesejado idGlobal(String idGlobal) {
        this.setIdGlobal(idGlobal);
        return this;
    }

    public void setIdGlobal(String idGlobal) {
        this.idGlobal = idGlobal;
    }

    public SituacaoItem getSituacao() {
        return this.situacao;
    }

    public ItemDesejado situacao(SituacaoItem situacao) {
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

    public ItemDesejado user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItemDesejado)) {
            return false;
        }
        return id != null && id.equals(((ItemDesejado) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItemDesejado{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", idGlobal='" + getIdGlobal() + "'" +
            ", situacao='" + getSituacao() + "'" +
            "}";
    }
}
