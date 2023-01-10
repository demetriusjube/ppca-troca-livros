package br.unb.ppca.trocalivros.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.unb.ppca.trocalivros.IntegrationTest;
import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;
import br.unb.ppca.trocalivros.repository.ItemDesejadoRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ItemDesejadoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemDesejadoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_ID_GLOBAL = "AAAAAAAAAA";
    private static final String UPDATED_ID_GLOBAL = "BBBBBBBBBB";

    private static final SituacaoItem DEFAULT_SITUACAO = SituacaoItem.DISPONIVEL;
    private static final SituacaoItem UPDATED_SITUACAO = SituacaoItem.INDISPONIVEL;

    private static final String ENTITY_API_URL = "/api/item-desejados";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemDesejadoRepository itemDesejadoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemDesejadoMockMvc;

    private ItemDesejado itemDesejado;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemDesejado createEntity(EntityManager em) {
        ItemDesejado itemDesejado = new ItemDesejado().nome(DEFAULT_NOME).idGlobal(DEFAULT_ID_GLOBAL).situacao(DEFAULT_SITUACAO);
        return itemDesejado;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemDesejado createUpdatedEntity(EntityManager em) {
        ItemDesejado itemDesejado = new ItemDesejado().nome(UPDATED_NOME).idGlobal(UPDATED_ID_GLOBAL).situacao(UPDATED_SITUACAO);
        return itemDesejado;
    }

    @BeforeEach
    public void initTest() {
        itemDesejado = createEntity(em);
    }

    @Test
    @Transactional
    void createItemDesejado() throws Exception {
        int databaseSizeBeforeCreate = itemDesejadoRepository.findAll().size();
        // Create the ItemDesejado
        restItemDesejadoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemDesejado))
            )
            .andExpect(status().isCreated());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeCreate + 1);
        ItemDesejado testItemDesejado = itemDesejadoList.get(itemDesejadoList.size() - 1);
        assertThat(testItemDesejado.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testItemDesejado.getIdGlobal()).isEqualTo(DEFAULT_ID_GLOBAL);
        assertThat(testItemDesejado.getSituacao()).isEqualTo(DEFAULT_SITUACAO);
    }

    @Test
    @Transactional
    void createItemDesejadoWithExistingId() throws Exception {
        // Create the ItemDesejado with an existing ID
        itemDesejado.setId(1L);

        int databaseSizeBeforeCreate = itemDesejadoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemDesejadoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemDesejado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItemDesejados() throws Exception {
        // Initialize the database
        itemDesejadoRepository.saveAndFlush(itemDesejado);

        // Get all the itemDesejadoList
        restItemDesejadoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemDesejado.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].idGlobal").value(hasItem(DEFAULT_ID_GLOBAL)))
            .andExpect(jsonPath("$.[*].situacao").value(hasItem(DEFAULT_SITUACAO.toString())));
    }

    @Test
    @Transactional
    void getItemDesejado() throws Exception {
        // Initialize the database
        itemDesejadoRepository.saveAndFlush(itemDesejado);

        // Get the itemDesejado
        restItemDesejadoMockMvc
            .perform(get(ENTITY_API_URL_ID, itemDesejado.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemDesejado.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.idGlobal").value(DEFAULT_ID_GLOBAL))
            .andExpect(jsonPath("$.situacao").value(DEFAULT_SITUACAO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingItemDesejado() throws Exception {
        // Get the itemDesejado
        restItemDesejadoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemDesejado() throws Exception {
        // Initialize the database
        itemDesejadoRepository.saveAndFlush(itemDesejado);

        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();

        // Update the itemDesejado
        ItemDesejado updatedItemDesejado = itemDesejadoRepository.findById(itemDesejado.getId()).get();
        // Disconnect from session so that the updates on updatedItemDesejado are not directly saved in db
        em.detach(updatedItemDesejado);
        updatedItemDesejado.nome(UPDATED_NOME).idGlobal(UPDATED_ID_GLOBAL).situacao(UPDATED_SITUACAO);

        restItemDesejadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemDesejado.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemDesejado))
            )
            .andExpect(status().isOk());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
        ItemDesejado testItemDesejado = itemDesejadoList.get(itemDesejadoList.size() - 1);
        assertThat(testItemDesejado.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testItemDesejado.getIdGlobal()).isEqualTo(UPDATED_ID_GLOBAL);
        assertThat(testItemDesejado.getSituacao()).isEqualTo(UPDATED_SITUACAO);
    }

    @Test
    @Transactional
    void putNonExistingItemDesejado() throws Exception {
        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();
        itemDesejado.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemDesejadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemDesejado.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemDesejado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemDesejado() throws Exception {
        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();
        itemDesejado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemDesejadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemDesejado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemDesejado() throws Exception {
        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();
        itemDesejado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemDesejadoMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemDesejado))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemDesejadoWithPatch() throws Exception {
        // Initialize the database
        itemDesejadoRepository.saveAndFlush(itemDesejado);

        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();

        // Update the itemDesejado using partial update
        ItemDesejado partialUpdatedItemDesejado = new ItemDesejado();
        partialUpdatedItemDesejado.setId(itemDesejado.getId());

        partialUpdatedItemDesejado.nome(UPDATED_NOME);

        restItemDesejadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemDesejado.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemDesejado))
            )
            .andExpect(status().isOk());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
        ItemDesejado testItemDesejado = itemDesejadoList.get(itemDesejadoList.size() - 1);
        assertThat(testItemDesejado.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testItemDesejado.getIdGlobal()).isEqualTo(DEFAULT_ID_GLOBAL);
        assertThat(testItemDesejado.getSituacao()).isEqualTo(DEFAULT_SITUACAO);
    }

    @Test
    @Transactional
    void fullUpdateItemDesejadoWithPatch() throws Exception {
        // Initialize the database
        itemDesejadoRepository.saveAndFlush(itemDesejado);

        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();

        // Update the itemDesejado using partial update
        ItemDesejado partialUpdatedItemDesejado = new ItemDesejado();
        partialUpdatedItemDesejado.setId(itemDesejado.getId());

        partialUpdatedItemDesejado.nome(UPDATED_NOME).idGlobal(UPDATED_ID_GLOBAL).situacao(UPDATED_SITUACAO);

        restItemDesejadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemDesejado.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemDesejado))
            )
            .andExpect(status().isOk());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
        ItemDesejado testItemDesejado = itemDesejadoList.get(itemDesejadoList.size() - 1);
        assertThat(testItemDesejado.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testItemDesejado.getIdGlobal()).isEqualTo(UPDATED_ID_GLOBAL);
        assertThat(testItemDesejado.getSituacao()).isEqualTo(UPDATED_SITUACAO);
    }

    @Test
    @Transactional
    void patchNonExistingItemDesejado() throws Exception {
        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();
        itemDesejado.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemDesejadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemDesejado.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemDesejado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemDesejado() throws Exception {
        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();
        itemDesejado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemDesejadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemDesejado))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemDesejado() throws Exception {
        int databaseSizeBeforeUpdate = itemDesejadoRepository.findAll().size();
        itemDesejado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemDesejadoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemDesejado))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemDesejado in the database
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemDesejado() throws Exception {
        // Initialize the database
        itemDesejadoRepository.saveAndFlush(itemDesejado);

        int databaseSizeBeforeDelete = itemDesejadoRepository.findAll().size();

        // Delete the itemDesejado
        restItemDesejadoMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemDesejado.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemDesejado> itemDesejadoList = itemDesejadoRepository.findAll();
        assertThat(itemDesejadoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
