package br.unb.ppca.trocalivros.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.unb.ppca.trocalivros.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemTrocaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItemTroca.class);
        ItemTroca itemTroca1 = new ItemTroca();
        itemTroca1.setId(1L);
        ItemTroca itemTroca2 = new ItemTroca();
        itemTroca2.setId(itemTroca1.getId());
        assertThat(itemTroca1).isEqualTo(itemTroca2);
        itemTroca2.setId(2L);
        assertThat(itemTroca1).isNotEqualTo(itemTroca2);
        itemTroca1.setId(null);
        assertThat(itemTroca1).isNotEqualTo(itemTroca2);
    }
}
