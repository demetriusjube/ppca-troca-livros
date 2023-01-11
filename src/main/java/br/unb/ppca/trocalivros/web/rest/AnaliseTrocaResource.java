package br.unb.ppca.trocalivros.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unb.ppca.trocalivros.troca.builder.TradeMaximizerInputBuilder;
import br.unb.ppca.trocalivros.troca.builder.TradeMaximizerResultBuilder;

@RestController
@RequestMapping("/api/analise-troca")
@Transactional
public class AnaliseTrocaResource {

	private final Logger log = LoggerFactory.getLogger(ItemDesejadoResource.class);

	@Autowired
	private TradeMaximizerInputBuilder tradeMaximizerInputBuilder;
	@Autowired
	private TradeMaximizerResultBuilder tradeMaximizerResultBuilder;

	/**
	 * {@code GET  /trocas-disponiveis} : Recupera as trocas disponíveis no banco de dados.
	 *
	 * @return A {@link String} com as trocas disponíveis no banco
	 */
	@GetMapping("/resultado")
	public String getResultado() {
		log.debug("REST request que retorna o resultado das trocas possíveis");
		return tradeMaximizerResultBuilder.build();
	}
	

	@GetMapping("/trocas-disponiveis")
	public String getTrocasDisponiveis() {
		log.debug("REST request to get trocas disponíveis no formato TM");
		return tradeMaximizerInputBuilder.build();
	}

}
