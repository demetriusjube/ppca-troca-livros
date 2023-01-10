package br.unb.ppca.trocalivros.web.rest;

import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.repository.ItemDesejadoRepository;
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
 * REST controller for managing {@link br.unb.ppca.trocalivros.domain.ItemDesejado}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItemDesejadoResource {

    private final Logger log = LoggerFactory.getLogger(ItemDesejadoResource.class);

    private static final String ENTITY_NAME = "itemDesejado";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItemDesejadoRepository itemDesejadoRepository;

    public ItemDesejadoResource(ItemDesejadoRepository itemDesejadoRepository) {
        this.itemDesejadoRepository = itemDesejadoRepository;
    }

    /**
     * {@code POST  /item-desejados} : Create a new itemDesejado.
     *
     * @param itemDesejado the itemDesejado to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itemDesejado, or with status {@code 400 (Bad Request)} if the itemDesejado has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/item-desejados")
    public ResponseEntity<ItemDesejado> createItemDesejado(@RequestBody ItemDesejado itemDesejado) throws URISyntaxException {
        log.debug("REST request to save ItemDesejado : {}", itemDesejado);
        if (itemDesejado.getId() != null) {
            throw new BadRequestAlertException("A new itemDesejado cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItemDesejado result = itemDesejadoRepository.save(itemDesejado);
        return ResponseEntity
            .created(new URI("/api/item-desejados/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /item-desejados/:id} : Updates an existing itemDesejado.
     *
     * @param id the id of the itemDesejado to save.
     * @param itemDesejado the itemDesejado to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemDesejado,
     * or with status {@code 400 (Bad Request)} if the itemDesejado is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itemDesejado couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/item-desejados/{id}")
    public ResponseEntity<ItemDesejado> updateItemDesejado(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItemDesejado itemDesejado
    ) throws URISyntaxException {
        log.debug("REST request to update ItemDesejado : {}, {}", id, itemDesejado);
        if (itemDesejado.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemDesejado.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemDesejadoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItemDesejado result = itemDesejadoRepository.save(itemDesejado);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemDesejado.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /item-desejados/:id} : Partial updates given fields of an existing itemDesejado, field will ignore if it is null
     *
     * @param id the id of the itemDesejado to save.
     * @param itemDesejado the itemDesejado to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemDesejado,
     * or with status {@code 400 (Bad Request)} if the itemDesejado is not valid,
     * or with status {@code 404 (Not Found)} if the itemDesejado is not found,
     * or with status {@code 500 (Internal Server Error)} if the itemDesejado couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/item-desejados/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItemDesejado> partialUpdateItemDesejado(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItemDesejado itemDesejado
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItemDesejado partially : {}, {}", id, itemDesejado);
        if (itemDesejado.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemDesejado.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemDesejadoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItemDesejado> result = itemDesejadoRepository
            .findById(itemDesejado.getId())
            .map(existingItemDesejado -> {
                if (itemDesejado.getNome() != null) {
                    existingItemDesejado.setNome(itemDesejado.getNome());
                }
                if (itemDesejado.getIdGlobal() != null) {
                    existingItemDesejado.setIdGlobal(itemDesejado.getIdGlobal());
                }
                if (itemDesejado.getSituacao() != null) {
                    existingItemDesejado.setSituacao(itemDesejado.getSituacao());
                }

                return existingItemDesejado;
            })
            .map(itemDesejadoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemDesejado.getId().toString())
        );
    }

    /**
     * {@code GET  /item-desejados} : get all the itemDesejados.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itemDesejados in body.
     */
    @GetMapping("/item-desejados")
    public List<ItemDesejado> getAllItemDesejados() {
        log.debug("REST request to get all ItemDesejados");
        return itemDesejadoRepository.findAll();
    }

    /**
     * {@code GET  /item-desejados/:id} : get the "id" itemDesejado.
     *
     * @param id the id of the itemDesejado to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itemDesejado, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/item-desejados/{id}")
    public ResponseEntity<ItemDesejado> getItemDesejado(@PathVariable Long id) {
        log.debug("REST request to get ItemDesejado : {}", id);
        Optional<ItemDesejado> itemDesejado = itemDesejadoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itemDesejado);
    }

    /**
     * {@code DELETE  /item-desejados/:id} : delete the "id" itemDesejado.
     *
     * @param id the id of the itemDesejado to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/item-desejados/{id}")
    public ResponseEntity<Void> deleteItemDesejado(@PathVariable Long id) {
        log.debug("REST request to delete ItemDesejado : {}", id);
        itemDesejadoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
