package br.unb.ppca.trocalivros.web.rest;

import br.unb.ppca.trocalivros.domain.RegistroTroca;
import br.unb.ppca.trocalivros.repository.RegistroTrocaRepository;
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
 * REST controller for managing {@link br.unb.ppca.trocalivros.domain.RegistroTroca}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RegistroTrocaResource {

    private final Logger log = LoggerFactory.getLogger(RegistroTrocaResource.class);

    private static final String ENTITY_NAME = "registroTroca";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegistroTrocaRepository registroTrocaRepository;

    public RegistroTrocaResource(RegistroTrocaRepository registroTrocaRepository) {
        this.registroTrocaRepository = registroTrocaRepository;
    }

    /**
     * {@code POST  /registro-trocas} : Create a new registroTroca.
     *
     * @param registroTroca the registroTroca to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new registroTroca, or with status {@code 400 (Bad Request)} if the registroTroca has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/registro-trocas")
    public ResponseEntity<RegistroTroca> createRegistroTroca(@RequestBody RegistroTroca registroTroca) throws URISyntaxException {
        log.debug("REST request to save RegistroTroca : {}", registroTroca);
        if (registroTroca.getId() != null) {
            throw new BadRequestAlertException("A new registroTroca cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RegistroTroca result = registroTrocaRepository.save(registroTroca);
        return ResponseEntity
            .created(new URI("/api/registro-trocas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /registro-trocas/:id} : Updates an existing registroTroca.
     *
     * @param id the id of the registroTroca to save.
     * @param registroTroca the registroTroca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registroTroca,
     * or with status {@code 400 (Bad Request)} if the registroTroca is not valid,
     * or with status {@code 500 (Internal Server Error)} if the registroTroca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/registro-trocas/{id}")
    public ResponseEntity<RegistroTroca> updateRegistroTroca(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RegistroTroca registroTroca
    ) throws URISyntaxException {
        log.debug("REST request to update RegistroTroca : {}, {}", id, registroTroca);
        if (registroTroca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registroTroca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroTrocaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RegistroTroca result = registroTrocaRepository.save(registroTroca);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registroTroca.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /registro-trocas/:id} : Partial updates given fields of an existing registroTroca, field will ignore if it is null
     *
     * @param id the id of the registroTroca to save.
     * @param registroTroca the registroTroca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated registroTroca,
     * or with status {@code 400 (Bad Request)} if the registroTroca is not valid,
     * or with status {@code 404 (Not Found)} if the registroTroca is not found,
     * or with status {@code 500 (Internal Server Error)} if the registroTroca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/registro-trocas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RegistroTroca> partialUpdateRegistroTroca(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RegistroTroca registroTroca
    ) throws URISyntaxException {
        log.debug("REST request to partial update RegistroTroca partially : {}, {}", id, registroTroca);
        if (registroTroca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, registroTroca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!registroTrocaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RegistroTroca> result = registroTrocaRepository
            .findById(registroTroca.getId())
            .map(existingRegistroTroca -> {
                if (registroTroca.getAceite() != null) {
                    existingRegistroTroca.setAceite(registroTroca.getAceite());
                }

                return existingRegistroTroca;
            })
            .map(registroTrocaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, registroTroca.getId().toString())
        );
    }

    /**
     * {@code GET  /registro-trocas} : get all the registroTrocas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of registroTrocas in body.
     */
    @GetMapping("/registro-trocas")
    public List<RegistroTroca> getAllRegistroTrocas() {
        log.debug("REST request to get all RegistroTrocas");
        return registroTrocaRepository.findAll();
    }

    /**
     * {@code GET  /registro-trocas/:id} : get the "id" registroTroca.
     *
     * @param id the id of the registroTroca to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the registroTroca, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/registro-trocas/{id}")
    public ResponseEntity<RegistroTroca> getRegistroTroca(@PathVariable Long id) {
        log.debug("REST request to get RegistroTroca : {}", id);
        Optional<RegistroTroca> registroTroca = registroTrocaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(registroTroca);
    }

    /**
     * {@code DELETE  /registro-trocas/:id} : delete the "id" registroTroca.
     *
     * @param id the id of the registroTroca to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/registro-trocas/{id}")
    public ResponseEntity<Void> deleteRegistroTroca(@PathVariable Long id) {
        log.debug("REST request to delete RegistroTroca : {}", id);
        registroTrocaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
