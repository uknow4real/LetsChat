import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout
from keras.optimizers import SGD
import json
import pickle
import random

nltk.download('punkt')
nltk.download('wordnet')

# initialize our variables
lemmatizer = WordNetLemmatizer()
words=[]
classes = []
documents = []
ignore = ['?', '!']

# open intents file
data_file = open('intents.json', encoding='utf-8').read()
intents = json.loads(data_file)

# go through all intents and the corresponding patterns to create a wordlist
# add the tags of the intents to those words
for intent in intents['intents']:
    for pattern in intent['patterns']:

        w = nltk.word_tokenize(pattern)
        words.extend(w)

        documents.append((w, intent['tag']))

        if intent['tag'] not in classes:
            classes.append(intent['tag'])

# grouping together the inflected forms of a word so they can be analysed as a single item
# convert the words to lowercase and ignore special characters ? and !
words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore]

# create sorted lists
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

# print the length of our relevant variables
print (len(documents), "Documents")
print (len(classes), "Classes", classes)
print (len(words), "Unique Lemmatized Words", words)

# use pickle to create/convert bytestream files from our lists
pickle.dump(words,open('words.pkl','wb'))
pickle.dump(classes,open('classes.pkl','wb'))

# initializing training data
training = []
output_empty = [0] * len(classes)
for doc in documents:
    bag = []

    pattern_words = doc[0]
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words]

    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)

    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1

    training.append([bag, output_row])

random.shuffle(training)
training = np.array(training)
# create train and test lists. X - patterns, Y - intents
train_x = list(training[:,0])
train_y = list(training[:,1])
print("Training data created")


# creating a 3 layer model (1st layer - 128 neurons, 2nd layer - 64 neurons, 3rd layer - contains number of neurons)
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(train_y[0]), activation='softmax'))

# Compile model. Stochastic gradient descent with Nesterov accelerated gradient gives good results for this model
sgd = SGD(learning_rate=0.01, decay=1e-6, momentum=0.9, nesterov=True)
model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# fitting the model - 300 epochs
hist = model.fit(np.array(train_x), np.array(train_y), epochs=300, batch_size=5, verbose=1)
# save the model
model.save('chatbot_model.h5', hist)
print("Model created.")