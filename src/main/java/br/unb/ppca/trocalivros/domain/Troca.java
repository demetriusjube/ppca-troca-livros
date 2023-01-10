package br.unb.ppca.trocalivros.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Troca.
 */
@Entity
@Table(name = "troca")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Troca implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "data_inicio")
    private Instant dataInicio;

    @Column(name = "data_fim")
    private Instant dataFim;

    @Lob
    @Column(name = "resultado")
    private String resultado;

    @OneToMany(mappedBy = "troca")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "troca" }, allowSetters = true)
    private Set<ItemTroca> itemTrocas = new HashSet<>();

    @OneToMany(mappedBy = "troca")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "origem", "destino", "troca" }, allowSetters = true)
    private Set<RegistroTroca> registroTrocas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Troca id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDataInicio() {
        return this.dataInicio;
    }

    public Troca dataInicio(Instant dataInicio) {
        this.setDataInicio(dataInicio);
        return this;
    }

    public void setDataInicio(Instant dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Instant getDataFim() {
        return this.dataFim;
    }

    public Troca dataFim(Instant dataFim) {
        this.setDataFim(dataFim);
        return this;
    }

    public void setDataFim(Instant dataFim) {
        this.dataFim = dataFim;
    }

    public String getResultado() {
        return this.resultado;
    }

    public Troca resultado(String resultado) {
        this.setResultado(resultado);
        return this;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public Set<ItemTroca> getItemTrocas() {
        return this.itemTrocas;
    }

    public void setItemTrocas(Set<ItemTroca> itemTrocas) {
        if (this.itemTrocas != null) {
            this.itemTrocas.forEach(i -> i.setTroca(null));
        }
        if (itemTrocas != null) {
            itemTrocas.forEach(i -> i.setTroca(this));
        }
        this.itemTrocas = itemTrocas;
    }

    public Troca itemTrocas(Set<ItemTroca> itemTrocas) {
        this.setItemTrocas(itemTrocas);
        return this;
    }

    public Troca addItemTroca(ItemTroca itemTroca) {
        this.itemTrocas.add(itemTroca);
        itemTroca.setTroca(this);
        return this;
    }

    public Troca removeItemTroca(ItemTroca itemTroca) {
        this.itemTrocas.remove(itemTroca);
        itemTroca.setTroca(null);
        return this;
    }

    public Set<RegistroTroca> getRegistroTrocas() {
        return this.registroTrocas;
    }

    public void setRegistroTrocas(Set<RegistroTroca> registroTrocas) {
        if (this.registroTrocas != null) {
            this.registroTrocas.forEach(i -> i.setTroca(null));
        }
        if (registroTrocas != null) {
            registroTrocas.forEach(i -> i.setTroca(this));
        }
        this.registroTrocas = registroTrocas;
    }

    public Troca registroTrocas(Set<RegistroTroca> registroTrocas) {
        this.setRegistroTrocas(registroTrocas);
        return this;
    }

    public Troca addRegistroTroca(RegistroTroca registroTroca) {
        this.registroTrocas.add(registroTroca);
        registroTroca.setTroca(this);
        return this;
    }

    public Troca removeRegistroTroca(RegistroTroca registroTroca) {
        this.registroTrocas.remove(registroTroca);
        registroTroca.setTroca(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Troca)) {
            return false;
        }
        return id != null && id.equals(((Troca) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Troca{" +
            "id=" + getId() +
            ", dataInicio='" + getDataInicio() + "'" +
            ", dataFim='" + getDataFim() + "'" +
            ", resultado='" + getResultado() + "'" +
            "}";
    }
}
