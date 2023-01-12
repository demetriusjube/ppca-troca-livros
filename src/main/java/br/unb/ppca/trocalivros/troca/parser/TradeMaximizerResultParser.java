package br.unb.ppca.trocalivros.troca.parser;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.unb.ppca.trocalivros.domain.RegistroTroca;
import br.unb.ppca.trocalivros.domain.Troca;
import br.unb.ppca.trocalivros.troca.exception.NenhumaTrocaRealizadaException;
import br.unb.ppca.trocalivros.troca.service.TrocaConstants;

@Component
public class TradeMaximizerResultParser {

	@Autowired
	private RegistroTrocaParser registroTrocaParser;
	
	
	public Troca buildTrocaFromResult(String tradeMaximizerOutput, Instant inicio, Instant fim) {
		Troca troca = new Troca();
		troca.setDataInicio(inicio);
		troca.setDataFim(fim);
		preencheRegistrosDeTroca(tradeMaximizerOutput, troca);
		return troca;
	}

	public void preencheRegistrosDeTroca(String tradeMaximizerOutput, Troca troca) {
		List<String> linhasDeResultado = transformTradeMaximizerToList(tradeMaximizerOutput);
		if (CollectionUtils.isEmpty(linhasDeResultado)) {
			throw new NenhumaTrocaRealizadaException();
		}
		for (String resultado : linhasDeResultado) {
			RegistroTroca registroTroca = registroTrocaParser.parseRegistroTrocaFromResult(resultado);
			troca.addRegistroTroca(registroTroca);
		}
	}
	
	/**
	 * Recupera as trocas como uma lista de Strings. Copiado de  https://github.com/rafasantos/matchandtrade-api
	 * @param tradeMaximizerOutput
	 * @return
	 */
	private static List<String> transformTradeMaximizerToList(String tradeMaximizerOutput) {
		String tradeMaximizerSummary = tradeMaximizerOutput.substring(tradeMaximizerOutput.indexOf(TrocaConstants.TOKEN_TRADE_LOOPS));
		String[] allLines = tradeMaximizerSummary.split(TrocaConstants.SEPARADOR_NOVA_LINHA);
		List<String> tradeLines = new ArrayList<>();
		// Get all tradeLines ignoring the HEADER and the ARTICLE SUMARRY portion.
		for (int i = 1; i< allLines.length; i++) {
			// Ignore empty lines or lines which does not start with (
			if (allLines[i].length() <= 1 || !allLines[i].startsWith(TrocaConstants.INICIO_SEPARADOR_USUARIO)) {
				continue;
			}
			tradeLines.add(allLines[i]);
		}
		return tradeLines;
	}
}
