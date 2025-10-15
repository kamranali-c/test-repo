It might be better to handle this transformation on the backend rather than in the front end. Relying on the UI to prepend - or # could lead to inconsistencies, and # isn’t a natural way to format guideline text.

Having the backend return the correctly formatted guideline content based on modelType would ensure consistency and reduce the risk of mismatch across clients.
