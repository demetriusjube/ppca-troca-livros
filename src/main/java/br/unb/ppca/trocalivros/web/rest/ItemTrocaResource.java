package br.unb.ppca.trocalivros.web.rest;

import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.repository.ItemTrocaRepository;
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
 * REST controller for managing {@link br.unb.ppca.trocalivros.domain.ItemTroca}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItemTrocaResource {

    private final Logger log = LoggerFactory.getLogger(ItemTrocaResource.class);

    private static final String ENTITY_NAME = "itemTroca";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItemTrocaRepository itemTrocaRepository;

    public ItemTrocaResource(ItemTrocaRepository itemTrocaRepository) {
        this.itemTrocaRepository = itemTrocaRepository;
    }

    /**
     * {@code POST  /item-trocas} : Create a new itemTroca.
     *
     * @param itemTroca the itemTroca to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itemTroca, or with status {@code 400 (Bad Request)} if the itemTroca has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/item-trocas")
    public ResponseEntity<ItemTroca> createItemTroca(@RequestBody ItemTroca itemTroca) throws URISyntaxException {
        log.debug("REST request to save ItemTroca : {}", itemTroca);
        if (itemTroca.getId() != null) {
            throw new BadRequestAlertException("A new itemTroca cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItemTroca result = itemTrocaRepository.save(itemTroca);
        return ResponseEntity
            .created(new URI("/api/item-trocas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /item-trocas/:id} : Updates an existing itemTroca.
     *
     * @param id the id of the itemTroca to save.
     * @param itemTroca the itemTroca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemTroca,
     * or with status {@code 400 (Bad Request)} if the itemTroca is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itemTroca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/item-trocas/{id}")
    public ResponseEntity<ItemTroca> updateItemTroca(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItemTroca itemTroca
    ) throws URISyntaxException {
        log.debug("REST request to update ItemTroca : {}, {}", id, itemTroca);
        if (itemTroca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemTroca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemTrocaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItemTroca result = itemTrocaRepository.save(itemTroca);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemTroca.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /item-trocas/:id} : Partial updates given fields of an existing itemTroca, field will ignore if it is null
     *
     * @param id the id of the itemTroca to save.
     * @param itemTroca the itemTroca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemTroca,
     * or with status {@code 400 (Bad Request)} if the itemTroca is not valid,
     * or with status {@code 404 (Not Found)} if the itemTroca is not found,
     * or with status {@code 500 (Internal Server Error)} if the itemTroca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/item-trocas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItemTroca> partialUpdateItemTroca(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItemTroca itemTroca
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItemTroca partially : {}, {}", id, itemTroca);
        if (itemTroca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemTroca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemTrocaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItemTroca> result = itemTrocaRepository
            .findById(itemTroca.getId())
            .map(existingItemTroca -> {
                if (itemTroca.getNome() != null) {
                    existingItemTroca.setNome(itemTroca.getNome());
                }
                if (itemTroca.getIdGlobal() != null) {
                    existingItemTroca.setIdGlobal(itemTroca.getIdGlobal());
                }
                if (itemTroca.getSituacao() != null) {
                    existingItemTroca.setSituacao(itemTroca.getSituacao());
                }

                return existingItemTroca;
            })
            .map(itemTrocaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemTroca.getId().toString())
        );
    }

    /**
     * {@code GET  /item-trocas} : get all the itemTrocas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itemTrocas in body.
     */
    @GetMapping("/item-trocas")
    public List<ItemTroca> getAllItemTrocas() {
        log.debug("REST request to get all ItemTrocas");
        return itemTrocaRepository.findAll();
    }

    /**
     * {@code GET  /item-trocas/:id} : get the "id" itemTroca.
     *
     * @param id the id of the itemTroca to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itemTroca, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/item-trocas/{id}")
    public ResponseEntity<ItemTroca> getItemTroca(@PathVariable Long id) {
        log.debug("REST request to get ItemTroca : {}", id);
        Optional<ItemTroca> itemTroca = itemTrocaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itemTroca);
    }

    /**
     * {@code DELETE  /item-trocas/:id} : delete the "id" itemTroca.
     *
     * @param id the id of the itemTroca to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/item-trocas/{id}")
    public ResponseEntity<Void> deleteItemTroca(@PathVariable Long id) {
        log.debug("REST request to delete ItemTroca : {}", id);
        itemTrocaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
