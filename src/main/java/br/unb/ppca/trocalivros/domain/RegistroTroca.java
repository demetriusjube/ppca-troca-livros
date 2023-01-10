package br.unb.ppca.trocalivros.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RegistroTroca.
 */
@Entity
@Table(name = "registro_troca")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RegistroTroca implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "aceite")
    private Boolean aceite;

    @JsonIgnoreProperties(value = { "user", "troca" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ItemTroca origem;

    @JsonIgnoreProperties(value = { "user", "troca" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ItemTroca destino;

    @ManyToOne
    @JsonIgnoreProperties(value = { "itemTrocas", "registroTrocas" }, allowSetters = true)
    private Troca troca;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RegistroTroca id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getAceite() {
        return this.aceite;
    }

    public RegistroTroca aceite(Boolean aceite) {
        this.setAceite(aceite);
        return this;
    }

    public void setAceite(Boolean aceite) {
        this.aceite = aceite;
    }

    public ItemTroca getOrigem() {
        return this.origem;
    }

    public void setOrigem(ItemTroca itemTroca) {
        this.origem = itemTroca;
    }

    public RegistroTroca origem(ItemTroca itemTroca) {
        this.setOrigem(itemTroca);
        return this;
    }

    public ItemTroca getDestino() {
        return this.destino;
    }

    public void setDestino(ItemTroca itemTroca) {
        this.destino = itemTroca;
    }

    public RegistroTroca destino(ItemTroca itemTroca) {
        this.setDestino(itemTroca);
        return this;
    }

    public Troca getTroca() {
        return this.troca;
    }

    public void setTroca(Troca troca) {
        this.troca = troca;
    }

    public RegistroTroca troca(Troca troca) {
        this.setTroca(troca);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RegistroTroca)) {
            return false;
        }
        return id != null && id.equals(((RegistroTroca) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RegistroTroca{" +
            "id=" + getId() +
            ", aceite='" + getAceite() + "'" +
            "}";
    }
}
