import os
import logging
import yara
from celery import shared_task

logger = logging.getLogger(__name__)

@shared_task
def yara_full_scan(file_path):
    logger.info("Start YARA scan for file: %s", file_path)
    try:
        # Ensure we use an absolute path for the rules file
        rules_path = os.path.join(os.path.dirname(__file__), 'yara_rules.yar')
        if not os.path.exists(rules_path):
            logger.error("YARA rules file not found: %s", rules_path)
            return {"status": "error", "report": {"detail": "YARA rules file not found."}}

        rules = yara.compile(filepath=rules_path)
        matches = rules.match(file_path)

        if matches:
            matched_rules = [match.rule for match in matches]
            result = {
                "status": "malicious",
                "report": {
                    "matched_rules": matched_rules,
                    "detail": "The file complies with YARA rules."
                }
            }
        else:
            result = {
                "status": "clean",
                "report": {"detail": "No suspicious patterns were found in the file."}
            }
    except Exception as e:
        logger.error("Error during YARA scan for file %s: %s", file_path, e, exc_info=True)
        result = {"status": "error", "report": {"detail": "Error scanning file with YARA."}}
    logger.info("Result of YARA scan for file %s: %s", file_path, result)
    return result
