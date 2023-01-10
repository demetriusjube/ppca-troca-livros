package br.unb.ppca.trocalivros.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.unb.ppca.trocalivros.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RegistroTrocaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RegistroTroca.class);
        RegistroTroca registroTroca1 = new RegistroTroca();
        registroTroca1.setId(1L);
        RegistroTroca registroTroca2 = new RegistroTroca();
        registroTroca2.setId(registroTroca1.getId());
        assertThat(registroTroca1).isEqualTo(registroTroca2);
        registroTroca2.setId(2L);
        assertThat(registroTroca1).isNotEqualTo(registroTroca2);
        registroTroca1.setId(null);
        assertThat(registroTroca1).isNotEqualTo(registroTroca2);
    }
}
