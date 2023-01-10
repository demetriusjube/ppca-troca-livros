package br.unb.ppca.trocalivros.web.rest;

import br.unb.ppca.trocalivros.domain.Troca;
import br.unb.ppca.trocalivros.repository.TrocaRepository;
import br.unb.ppca.trocalivros.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.unb.ppca.trocalivros.domain.Troca}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TrocaResource {

    private final Logger log = LoggerFactory.getLogger(TrocaResource.class);

    private static final String ENTITY_NAME = "troca";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TrocaRepository trocaRepository;

    public TrocaResource(TrocaRepository trocaRepository) {
        this.trocaRepository = trocaRepository;
    }

    /**
     * {@code POST  /trocas} : Create a new troca.
     *
     * @param troca the troca to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new troca, or with status {@code 400 (Bad Request)} if the troca has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/trocas")
    public ResponseEntity<Troca> createTroca(@RequestBody Troca troca) throws URISyntaxException {
        log.debug("REST request to save Troca : {}", troca);
        if (troca.getId() != null) {
            throw new BadRequestAlertException("A new troca cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Troca result = trocaRepository.save(troca);
        return ResponseEntity
            .created(new URI("/api/trocas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /trocas/:id} : Updates an existing troca.
     *
     * @param id the id of the troca to save.
     * @param troca the troca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated troca,
     * or with status {@code 400 (Bad Request)} if the troca is not valid,
     * or with status {@code 500 (Internal Server Error)} if the troca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/trocas/{id}")
    public ResponseEntity<Troca> updateTroca(@PathVariable(value = "id", required = false) final Long id, @RequestBody Troca troca)
        throws URISyntaxException {
        log.debug("REST request to update Troca : {}, {}", id, troca);
        if (troca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, troca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trocaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Troca result = trocaRepository.save(troca);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, troca.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /trocas/:id} : Partial updates given fields of an existing troca, field will ignore if it is null
     *
     * @param id the id of the troca to save.
     * @param troca the troca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated troca,
     * or with status {@code 400 (Bad Request)} if the troca is not valid,
     * or with status {@code 404 (Not Found)} if the troca is not found,
     * or with status {@code 500 (Internal Server Error)} if the troca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/trocas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Troca> partialUpdateTroca(@PathVariable(value = "id", required = false) final Long id, @RequestBody Troca troca)
        throws URISyntaxException {
        log.debug("REST request to partial update Troca partially : {}, {}", id, troca);
        if (troca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, troca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trocaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Troca> result = trocaRepository
            .findById(troca.getId())
            .map(existingTroca -> {
                if (troca.getDataInicio() != null) {
                    existingTroca.setDataInicio(troca.getDataInicio());
                }
                if (troca.getDataFim() != null) {
                    existingTroca.setDataFim(troca.getDataFim());
                }
                if (troca.getResultado() != null) {
                    existingTroca.setResultado(troca.getResultado());
                }

                return existingTroca;
            })
            .map(trocaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, troca.getId().toString())
        );
    }

    /**
     * {@code GET  /trocas} : get all the trocas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of trocas in body.
     */
    @GetMapping("/trocas")
    public List<Troca> getAllTrocas() {
        log.debug("REST request to get all Trocas");
        return trocaRepository.findAll();
    }

    /**
     * {@code GET  /trocas/:id} : get the "id" troca.
     *
     * @param id the id of the troca to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the troca, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trocas/{id}")
    public ResponseEntity<Troca> getTroca(@PathVariable Long id) {
        log.debug("REST request to get Troca : {}", id);
        Optional<Troca> troca = trocaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(troca);
    }

    /**
     * {@code DELETE  /trocas/:id} : delete the "id" troca.
     *
     * @param id the id of the troca to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trocas/{id}")
    public ResponseEntity<Void> deleteTroca(@PathVariable Long id) {
        log.debug("REST request to delete Troca : {}", id);
        trocaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
