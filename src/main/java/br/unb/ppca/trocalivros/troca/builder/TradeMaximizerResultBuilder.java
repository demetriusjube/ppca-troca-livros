package br.unb.ppca.trocalivros.troca.builder;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import tm.TradeMaximizer;

@Component
public class TradeMaximizerResultBuilder {
	
	private final Logger log = LoggerFactory.getLogger(TradeMaximizerResultBuilder.class);

	@Autowired
	private TradeMaximizerInputBuilder tradeMaximizerInputBuilder;

	@Transactional
	public String build() {
		String tradeMaximizerInputString = tradeMaximizerInputBuilder.build();
		return buildTradeMaximizerOutput(tradeMaximizerInputString);
	}

	/**
	 * Código para rodar o TradeMaximizer. Adaptado de https://github.com/rafasantos/matchandtrade-api
	 * @param tradeMaximizerInputString
	 * @return
	 */
	private String buildTradeMaximizerOutput(String tradeMaximizerInputString) {
		log.info("Using TradeMaximizer input:\n{}", tradeMaximizerInputString);
		InputStream tradeMaximizerInput = new ByteArrayInputStream(tradeMaximizerInputString.getBytes());
		OutputStream tradeMaximizerOuput = new ByteArrayOutputStream();
		TradeMaximizer tradeMaximizer = new TradeMaximizer(tradeMaximizerInput, tradeMaximizerOuput);
		tradeMaximizer.run();
		String result = tradeMaximizerOuput.toString();
		try {
			tradeMaximizerOuput.close();
		} catch (IOException e) {
			throw new RuntimeException("Error when build TradeMaximizer output. " + e.getMessage());
		}
		log.debug("TradeMaximizer output:\n{}", result);
		return result;
	}

}
